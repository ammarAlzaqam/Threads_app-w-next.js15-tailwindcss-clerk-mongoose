"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import connectDB from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    await connectDB();

    const newThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    await connectDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const posts = await postsQuery.exec();

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch {
    throw new Error("");
  }
}

export async function fetchThreadById(postId: string) {
  await connectDB();

  try {
    // TODO: Populate Community
    const thread = await Thread.findById(postId)
      .populate({ path: "author", select: "_id id name image" })
      .populate({
        path: "children",
        populate: [
          { path: "author", select: "_id id name parentId image" },
          {
            path: "children",
            populate: { path: "author", select: "_id id name parentId image" },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    console.log(error);
  }
}

interface AddCommentParams {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: AddCommentParams) {
  await connectDB();

  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) throw new Error("Tread not found");

    const currentUser = await User.findById(userId);
    if (!currentUser) throw new Error("User not found");

    const commentThread = await Thread.create({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    originalThread.children.addToSet(commentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (e) {
    console.log(e);
  }
}
