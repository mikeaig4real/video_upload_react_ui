import type { BundledLanguage } from "@/components/ui/code-block";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
} from "@/components/ui/code-block";

export interface CodeFile {
  language: BundledLanguage | string;
  filename: string;
  code: string;
}

interface CodeBlockDemoProps {
  files: CodeFile[];
  defaultLanguage?: string;
  onCopy?: () => void;
  onError?: () => void;
}

const CodeBlockDemo: React.FC<CodeBlockDemoProps> = ({
  files,
  defaultLanguage,
  onCopy,
  onError,
}) => {
  return (
    <CodeBlock
      data={files}
      defaultValue={defaultLanguage ?? files[0]?.language}
    >
      <CodeBlockHeader className="dark:bg-black">
        <CodeBlockFiles>
          {(item) => (
            <CodeBlockFilename
              className="dark:bg-black"
              key={item.language}
              value={item.language}
            >
              {item.filename}
            </CodeBlockFilename>
          )}
        </CodeBlockFiles>

        <CodeBlockSelect>
          <CodeBlockSelectTrigger>
            <CodeBlockSelectValue />
          </CodeBlockSelectTrigger>
          <CodeBlockSelectContent className="dark:bg-black">
            {(item) => (
              <CodeBlockSelectItem className="dark:bg-black" key={item.language} value={item.language}>
                {item.language}
              </CodeBlockSelectItem>
            )}
          </CodeBlockSelectContent>
        </CodeBlockSelect>

        <CodeBlockCopyButton
          onCopy={onCopy ?? (() => console.log("Copied code to clipboard"))}
          onError={onError ?? (() => console.error("Failed to copy code"))}
        />
      </CodeBlockHeader>

      <CodeBlockBody>
        {(item) => (
          <CodeBlockItem key={item.language} value={item.language}>
            <CodeBlockContent language={item.language as BundledLanguage}>
              {item.code}
            </CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  );
};

export default CodeBlockDemo;
