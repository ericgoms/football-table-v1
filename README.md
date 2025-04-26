# ![CartolaApp Logo](src/assets/logo.png) CartolaApp

CartolaApp é uma plataforma moderna para gerenciar times e acompanhar pontuações no Cartola FC. Com uma interface intuitiva e recursos poderosos, você pode organizar seus times, registrar pontuações e visualizar rankings de forma prática e eficiente.

## 🚀 Recursos Principais

- **Gerenciamento de Times**: Adicione e edite informações dos seus times, incluindo nome e escudo.
- **Pontuações por Rodada**: Registre e acompanhe as pontuações de cada rodada.
- **Ranking Geral**: Visualize a classificação geral dos times com base nas pontuações acumuladas.
- **Tema Escuro**: Alterne entre os modos claro e escuro para uma experiência personalizada.

## 🛠️ Como Executar o Projeto

### Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm start
```

Acesse o aplicativo em [http://localhost:4200/](http://localhost:4200/). O servidor recarregará automaticamente ao salvar alterações nos arquivos.

### Construção do Projeto

Para gerar os artefatos de build, execute:

```bash
npm run build
```

Os arquivos serão gerados no diretório `dist/`.

### Testes Unitários

Execute os testes unitários com o comando:

```bash
npm test
```

### Testes End-to-End

Para testes end-to-end, configure e execute:

```bash
ng e2e
```

## 📂 Estrutura do Projeto

```plaintext
src/
├── app/
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/            # Páginas principais do aplicativo
│   ├── services/         # Serviços para lógica de negócios e integração
│   ├── app.component.ts  # Componente raiz
│   └── ...
├── assets/               # Imagens e outros recursos estáticos
├── environments/         # Configurações de ambiente
└── styles.scss           # Estilos globais
```

## 🖼️ Prévia do Projeto

![CartolaApp Preview](src/assets/login-section2.png)

## 📚 Tecnologias Utilizadas

- **Angular**: Framework para construção de interfaces modernas.
- **Supabase**: Backend como serviço para autenticação e banco de dados.
- **SCSS**: Estilização avançada com suporte a variáveis e mixins.
- **Express**: Servidor para renderização SSR.

## 🤝 Contribuições

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Commit suas alterações: `git commit -m 'Adiciona minha feature'`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Feito com ❤️ por [Seu Nome].
