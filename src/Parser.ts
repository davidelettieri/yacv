enum TokenType {
    STRING,
    CR_LF,
    LF,
    DQUOTE,
    CR,
    COMMA,
    DQUOTE_DQUOTE,
    EOF
}

class Token {
    readonly Type: TokenType
    readonly Literal: string
    readonly Line: number
    /**
     *
     */
    constructor(type: TokenType, literal: string, line: number) {
        this.Type = type;
        this.Literal = literal;
        this.Line = line;
    }

    /**
     * ToString
     */
    public ToString() {
        return `${this.Type} ${this.Literal} ${this.Line}`;
    }
}

class Scanner {
    private readonly _source: string
    private readonly _tokens: Token[] = []
    private readonly _delimiter: string
    private _start = 0
    private _current = 0
    private _line = 1
    private static readonly _reserved = ['"', '\r', '\n', '\0'];

    constructor(source: string, delimiter: string) {
        this._source = source;
        this._delimiter = delimiter;
    }

    public ScanTokens(): Token[] {
        while (!this.IsAtEnd()) {
            this._start = this._current;
            this.ScanToken();
        }

        this._tokens.push(new Token(TokenType.EOF, "end", this._line));
        return this._tokens;
    }

    private ScanToken() {
        var c = this.Advance();

        switch (c) {
            case this._delimiter: this.AddToken(TokenType.COMMA); break;
            case '"':
                if (this.Peek() == '"') {
                    this.Advance();
                    this.AddToken(TokenType.DQUOTE_DQUOTE);
                }
                else
                    this.AddToken(TokenType.DQUOTE);
                break;
            case '\r':
                if (this.Peek() == '\n') {
                    this.Advance();
                    this.AddToken(TokenType.CR_LF);
                }
                else
                    this.AddToken(TokenType.CR);
                break;
            case '\n':
                this.AddToken(TokenType.LF);
                break;
            default:
                this.Text();
                break;
        }
    }

    private Text() {
        while (Scanner._reserved.indexOf(this.Peek()) == -1 && this.Peek() != this._delimiter) this.Advance();

        this.AddToken(TokenType.STRING);
    }

    private Peek(): string {
        if (this.IsAtEnd()) {
            return '\0';
        }

        return this._source[this._current];
    }

    private IsAtEnd(): boolean {
        return this._current >= this._source.length;
    }
    private Advance(): string {
        this._current++;
        return this._source[this._current - 1];
    }

    private AddToken(type: TokenType) {
        this._tokens.push(new Token(type, this._source.substring(this._start, this._current), this._line));
    }
}

class Parser {
    private readonly _tokens: Token[]
    private _current = 0

    constructor(tokens: Token[]) {
        this._tokens = tokens;
    }

    public Parse(): string[][] {
        var rows = [];

        while (!this.IsAtEnd()) {
            rows.push(this.Record());
        }

        return rows;
    }

    private Record(): string[] {
        var record = [this.Field()];

        while (this.Match(TokenType.COMMA)) {
            record.push(this.Field());
        }

        if (!this.Match(TokenType.CR_LF, TokenType.LF)) {
            throw this.GetError(this.Previous(), "Expect crlf or lf after record.");
        }


        return record;
    }

    private Field(): string {
        var field = this.NonEscaped();

        if (field == null || field.trim() == '') {
            field = this.Escaped();
        }

        return field;
    }

    private NonEscaped(): string {
        if (this.Match(TokenType.STRING)) {
            return this.Previous().Literal;
        }

        return "";
    }

    private Escaped(): string {
        if (this.Match(TokenType.DQUOTE)) {
            var sb = "";
            while (!this.IsAtEnd() && this.Peek().Type != TokenType.DQUOTE) {
                if (this.Match(TokenType.STRING, TokenType.COMMA, TokenType.CR, TokenType.LF)) {
                    sb = sb.concat(this.Previous().Literal);
                }
                else if (this.Match(TokenType.DQUOTE_DQUOTE)) {
                    sb = sb.concat('"');
                }
            }

            this.Advance();

            return sb;
        }

        return null;
    }

    private Match(...types: TokenType[]): boolean {
        for (var i = 0; i < types.length; i++) {
            if (this.Check(types[i])) {
                this.Advance();
                return true;
            }
        }
        return false;
    }

    private Check(type: TokenType): boolean {
        if (this.IsAtEnd()) return false;
        return this.Peek().Type == type;
    }

    private Advance(): Token {
        if (!this.IsAtEnd()) this._current++;

        return this.Previous();
    }

    private IsAtEnd(): boolean {
        return this.Peek().Type == TokenType.EOF;
    }

    private Peek(): Token {
        return this._tokens[this._current];
    }
    private Previous(): Token {
        return this._tokens[this._current - 1];
    }

    public GetError(token: Token, message: string): Error {
        return new Error(`[line ${token.Line} ] Error at ${token.Literal}: ${message}`);
    }
}

class ParseError {
    name: string;
    message: string;
    stack?: string;
    constructor(token: Token, message: string) {
    }
}