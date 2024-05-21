const subscriptTemplate = "{% sub %}\n$1\n{% /sub %}";

function handleSubscript(text: string) {
  return text.replace(/~(.+?)~/g, subscriptTemplate);
}

export function preprocessMarkdown(text: string) {
  // Échappe les blocs de code pour éviter de modifier les sauts de ligne à l'intérieur
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const parts = text.split(codeBlockRegex);

  for (let i = 0; i < parts.length; i++) {
    // Traite seulement les parties qui ne sont pas des blocs de code
    if (!parts[i].startsWith("```")) {
      // Double les sauts de ligne pour assurer une séparation correcte des paragraphes
      parts[i] = parts[i].replace(/\n/g, "\n\n");
    }
  }

  return handleSubscript(parts.join(""));
}
