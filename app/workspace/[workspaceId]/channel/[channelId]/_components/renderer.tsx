"use client";

import { Doc } from "@/convex/_generated/dataModel";
import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";

interface RendererProps {
  value: Doc<"messages">["body"];
}
const Renderer = ({ value }: RendererProps) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;
    const container = rendererRef.current;
    const quill = new Quill(document.createElement("div"), { theme: "snow" });
    quill.enable(false);
    const contents = JSON.parse(value);
    quill.setContents(contents);
    const text = quill.getText();
    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
    setIsEmpty(isEmpty);
    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);

  if (isEmpty) return;
  return (
    <div ref={rendererRef} className="ql-editor ql-renderer">
      Renderer
    </div>
  );
};

export default Renderer;
