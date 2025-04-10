var TokenType;
(function (TokenType) {
    TokenType[TokenType["STRING"] = 0] = "STRING";
    TokenType[TokenType["CR_LF"] = 1] = "CR_LF";
    TokenType[TokenType["LF"] = 2] = "LF";
    TokenType[TokenType["DQUOTE"] = 3] = "DQUOTE";
    TokenType[TokenType["CR"] = 4] = "CR";
    TokenType[TokenType["COMMA"] = 5] = "COMMA";
    TokenType[TokenType["DQUOTE_DQUOTE"] = 6] = "DQUOTE_DQUOTE";
    TokenType[TokenType["EOF"] = 7] = "EOF";
})(TokenType || (TokenType = {}));
class Token {
    /**
     *
     */
    constructor(type, literal, line) {
        this.Type = type;
        this.Literal = literal;
        this.Line = line;
    }
    /**
     * ToString
     */
    ToString() {
        return `${this.Type} ${this.Literal} ${this.Line}`;
    }
}
export class Scanner {
    constructor(source, delimiter) {
        this._tokens = [];
        this._start = 0;
        this._current = 0;
        this._line = 1;
        this._source = source;
        this._delimiter = delimiter;
    }
    ScanTokens() {
        while (!this.IsAtEnd()) {
            this._start = this._current;
            this.ScanToken();
        }
        this._tokens.push(new Token(TokenType.EOF, "EOF", this._line));
        return this._tokens;
    }
    ScanToken() {
        var c = this.Advance();
        switch (c) {
            case this._delimiter:
                this.AddToken(TokenType.COMMA);
                break;
            case ' ':
                break;
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
    Text() {
        while (Scanner._reserved.indexOf(this.Peek()) == -1 && this.Peek() != this._delimiter)
            this.Advance();
        this.AddToken(TokenType.STRING);
    }
    Peek() {
        if (this.IsAtEnd()) {
            return '\0';
        }
        return this._source[this._current];
    }
    IsAtEnd() {
        return this._current >= this._source.length;
    }
    Advance() {
        this._current++;
        return this._source[this._current - 1];
    }
    AddToken(type) {
        this._tokens.push(new Token(type, this._source.substring(this._start, this._current), this._line));
    }
}
Scanner._reserved = ['"', '\r', '\n', '\0'];
export class Parser {
    constructor(tokens) {
        this._current = 0;
        this._tokens = tokens;
    }
    Parse() {
        var rows = [];
        while (!this.IsAtEnd()) {
            rows.push(this.Record());
            // In RFC 4180 each record is delimited by a line break CRLF
            // we support also ending a record line with LF or CR
            if (!this.Match(TokenType.CR_LF, TokenType.LF, TokenType.CR) && !this.IsAtEnd()) {
                throw this.GetError(this.Previous(), "Expect crlf, lf, cr, EOF after record.");
            }
        }
        return rows;
    }
    Record() {
        var record = [this.Field()];
        while (this.Match(TokenType.COMMA)) {
            record.push(this.Field());
        }
        return record;
    }
    Field() {
        if (this.Match(TokenType.DQUOTE)) {
            return this.Escaped();
        }
        return this.NonEscaped();
    }
    NonEscaped() {
        if (this.Match(TokenType.STRING)) {
            return this.Previous().Literal;
        }
        return "";
    }
    Escaped() {
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
    Match(...types) {
        for (var i = 0; i < types.length; i++) {
            if (this.Check(types[i])) {
                this.Advance();
                return true;
            }
        }
        return false;
    }
    Check(type) {
        if (this.IsAtEnd())
            return false;
        return this.Peek().Type == type;
    }
    Advance() {
        if (!this.IsAtEnd())
            this._current++;
        return this.Previous();
    }
    IsAtEnd() {
        return this.Peek().Type == TokenType.EOF;
    }
    Peek() {
        return this._tokens[this._current];
    }
    Previous() {
        return this._tokens[this._current - 1];
    }
    GetError(token, message) {
        return new Error(`[line ${token.Line} ] Error at ${token.Literal}: ${message}`);
    }
}
