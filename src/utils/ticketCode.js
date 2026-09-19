const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateTicketCode = (length = 8) => {
    const characters = [];

    for (let i = 0; i < length; i++) {
        characters.push(ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length)));
    }
    return `TK-${characters.join("")}`;
};