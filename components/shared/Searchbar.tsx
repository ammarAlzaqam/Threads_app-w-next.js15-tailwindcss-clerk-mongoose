import Form from "next/form";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import Clear from "./Clear";

export default function Searchbar({query, path}: {query: string, path: string}) {
  return (
    <Form action={path} scroll={false} className="searchbar">
      <Search className="text-base-regular text-light-4" />
      <Input
        name="query"
        type="text"
        className="no-focus searchbar_input"
        placeholder={`Search ${path === "/search" ? "users" : "communities"}`}
      />
      <Clear query={query} path={path} />
    </Form>
  );
}
