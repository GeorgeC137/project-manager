import { Link } from "@inertiajs/react";

export default function Pagination({ links, queryParams = {} }) {
  return (
    <nav className="text-center mt-4">
      {links.map((link) => {
        let href = "";
        if (link.url) {
          // Remove 'page' from queryParams to avoid duplicate page params
          const { page, ...paramsWithoutPage } = queryParams;
          const queryString = new URLSearchParams(paramsWithoutPage).toString();
          if (queryString) {
            href = link.url + (link.url.includes("?") ? "&" : "?") + queryString;
          } else {
            href = link.url;
          }
        }
        return (
          <Link
            preserveScroll
            href={href}
            key={link.label}
            className={
              "inline-block py-2 px-3 rounded-lg text-gray-200 text-xs " +
              (link.active ? "bg-gray-950 " : " ") +
              (!link.url
                ? "!text-gray-500 cursor-not-allowed "
                : "hover:bg-gray-950")
            }
            dangerouslySetInnerHTML={{ __html: link.label }}
          ></Link>
        );
      })}
    </nav>
  );
}