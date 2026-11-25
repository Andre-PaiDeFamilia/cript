// ==========================================
// AULA 1: Deslocamento Numérico
// ==========================================
function executarAula1() {
    const senha = document.getElementById("input-aula1").value;
    let senhaCriptografada = "";

    for (let i = 0; i < senha.length; i++) {
        const char = senha[i];
        if (!isNaN(char) && char !== " ") {
            const numero = parseInt(char, 10) + 1;
            senhaCriptografada += numero.toString();
        } else {
            senhaCriptografada += char;
        }
    }

    document.getElementById("res-aula1").textContent = `Resultado: ${senhaCriptografada}`;
}

// ==========================================
// AULAS 2 e 3: Cifra de Substituição
// ==========================================
function codifica(senha) {
    const dicionario = "qwertyuiopasdfghjklzxcvbnm";
    let senhaCriptografada = "";

    for (let i = 0; i < senha.length; i++) {
        const letra = senha[i];
        if (letra >= "a" && letra <= "z") {
            const posicao = letra.charCodeAt(0) - "a".charCodeAt(0);
            senhaCriptografada += dicionario[posicao];
        } else {
            senhaCriptografada += letra;
        }
    }
    return senhaCriptografada;
}

function executarAula2() {
    const senha = document.getElementById("input-aula2").value;
    const resultado = codifica(senha);
    document.getElementById("res-aula2").textContent = `A senha '${senha}' criptografada é: ${resultado}`;
}

// ==========================================
// AULAS 4, 5 e 6: Função Hash & Autenticação
// ==========================================
function calculaHash(senha) {
    let valor = 0;
    const mod = Math.pow(2, 32);

    for (let i = 0; i < senha.length; i++) {
        // Math.imul garante multiplicação exata de inteiros de 32 bits como no Python
        valor = (Math.imul(valor, 31) + senha.charCodeAt(i)) >>> 0;
        valor = valor % mod;
    }

    return "0x" + valor.toString(16).padStart(8, "0");
}

function executarAula4() {
    const senhaCadastrada = "marcelo123";
    const hashCadastrado = calculaHash(senhaCadastrada);

    const senhaDigitada = document.getElementById("input-aula4").value;
    const hashDigitado = calculaHash(senhaDigitada);
    const resEl = document.getElementById("res-aula4");

    if (hashCadastrado === hashDigitado) {
        resEl.innerHTML = `<span class="sucesso">ACESSO LIBERADO</span> (Hash: ${hashDigitado})`;
    } else {
        resEl.innerHTML = `<span class="erro">ACESSO NEGADO</span> (Hash gerado: ${hashDigitado} ≠ ${hashCadastrado})`;
    }
}

// ==========================================
// AULA 7: Senhas Comuns & Combinações
// ==========================================
function executarAula7() {
    const senhasComuns = [
        "123456", "password", "123456789", "qwerty", "12345678",
        "111111", "12345", "columbia", "senha", "iloveyou"
    ];

    const hashCadastrado = calculaHash("marcelo123");
    let htmlOutput = `<strong>Hash Alvo (marcelo123):</strong> ${hashCadastrado}<br><br>`;

    senhasComuns.forEach(senha => {
        const h = calculaHash(senha);
        htmlOutput += `Senha: <code>${senha}</code> ➔ Hash: <code>${h}</code><br>`;
    });

    document.getElementById("res-aula7").innerHTML = htmlOutput;
}

// ==========================================
// AULA 8: Força Bruta (Adaptado para Web)
// ==========================================
function executarAula8() {
    const senhaAlvo = document.getElementById("input-aula8").value;
    const resEl = document.getElementById("res-aula8");

    if (!senhaAlvo) {
        resEl.textContent = "Digite uma senha curta para testar.";
        return;
    }

    const hashAlvo = calculaHash(senhaAlvo);
    const dicionario = "abcdefghijklmnopqrstuvwxyzABC123!@#$";
    const maxTentativas = 500000; // Trava de segurança para não congelar a aba do navegador
    let tentativas = 0;
    let encontrada = null;

    // Função recursiva para simular o itertools.product do Python
    function gerarCombinacoes(prefixo, tamanhoRestante) {
        if (encontrada || tentativas >= maxTentativas) return;

        if (tamanhoRestante === 0) {
            tentativas++;
            if (calculaHash(prefixo) === hashAlvo) {
                encontrada = prefixo;
            }
            return;
        }

        for (let i = 0; i < dicionario.length; i++) {
            gerarCombinacoes(prefixo + dicionario[i], tamanhoRestante - 1);
            if (encontrada || tentativas >= maxTentativas) return;
        }
    }

    const inicio = performance.now();
    gerarCombinacoes("", senhaAlvo.length);
    const tempoMs = (performance.now() - inicio).toFixed(2);

    if (encontrada) {
        resEl.innerHTML = `<span class="sucesso">Senha quebrada: '${encontrada}'</span> em ${tentativas.toLocaleString()} tentativas (${tempoMs} ms).`;
    } else {
        resEl.innerHTML = `<span class="erro">Interrompido!</span> Limite de ${maxTentativas.toLocaleString()} tentativas atingido sem quebrar o hash <code>${hashAlvo}</code>. (Senhas longas exigem poder computacional massivo).`;
    }
}
