import * as React from "react";

interface TextStyle {
  title: string;
  content: string;
  copy: string;
}

interface ContentStyle {
  note: TextStyle;
  caution: TextStyle;
  warning: TextStyle;
  check: TextStyle;
}

export default function Callout({
  title,
  type,
  children,
}: Readonly<{
  title: string;
  type: string;
  children: React.ReactNode;
}>) {
  const contentStyleObj: ContentStyle = {
    note: {
      content: "bg-blue-100 border-blue-500",
      title: "text-blue-800",
      copy: "text-blue-800",
    },
    caution: {
      content: "bg-yellow-100 border-yellow-500",
      title: "text-yellow-800",
      copy: "text-yellow-800",
    },
    warning: {
      content: "bg-red-100 border-red-500",
      title: "text-red-800",
      copy: "text-red-800",
    },
    check: {
      content: "bg-green-100 border-green-500",
      title: "text-green-800",
      copy: "text-green-800",
    },
  };
  
  const contentStyle = new Map<string, TextStyle>();
  for (const [key, value] of Object.entries(contentStyleObj)) {
    console.log(key);
    contentStyle.set(key, value);
  }
  console.log(contentStyle.get(type));
  console.log(type);

  return (
    <div className="callout">
      <div
        className={
          "content px-3 py-2 rounded-sm " + contentStyle.get(type)?.content
        }
      >
        <div className="copy">
          <span className={"font-bold " + contentStyle.get(type)?.title}>
            {title}
          </span>
          <span className={"" + contentStyle.get(type)?.copy}>{children}</span>
        </div>
      </div>
    </div>
  );
}
