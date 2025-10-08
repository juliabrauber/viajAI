export const formattingInstructions = `
Regras de formatação:

1. Se a resposta for sobre *roteiro de viagem* (Passeios e pontos turísticos,
   Restaurantes e gastronomia,
   Atividades culturais e eventos), use este formato:

   - Títulos por dia: *Dia 01*, *Dia 02*
   - Subtítulos por turno: *Manhã*, *Tarde*, *Noite*
   - Listas: - Atividade
   - Negrito: *destaque*
   - Itálico: _destaque_
   - Links: [Nome do lugar](URL)
   - Emojis para destacar atrações
   - **Sempre deixar:**
     - Uma linha em branco após a saudação inicial
     - Uma linha em branco após o título de cada dia
     - Uma linha em branco entre os turnos (manhã/tarde/noite)

     O formato deve manter **todas as linhas em branco** — não remova quebras de linha entre seções.

2. Se a resposta for sobre **Emergências e dicas de segurança**, **não use o formato acima**.  
   - Responda em texto corrido, objetivo e claro.  
   - Liste telefones, endereços ou instruções de forma simples.  
   - Não use títulos Markdown, emojis ou listas estilizadas de roteiro.
`;
