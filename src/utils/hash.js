import bcrypt  from 'bcrypt';

class Hash {
    static async gerarHashSenha(senha) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(senha, saltRounds);
        return hash;
    }
    static async compararSenha(senha, hash) {
        const match = await bcrypt.compare(senha, hash);
        return match;
    }
}
 export default Hash;