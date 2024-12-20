export default function Subscript({ children }: Readonly<{ children: React.ReactNode }>) {
  return <sub className="text-xs text-gray-500">{children}</sub>;
}
