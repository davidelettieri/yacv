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
var Token = /** @class */ (function () {
    /**
     *
     */
    function Token(type, literal, line) {
        this.Type = type;
        this.Literal = literal;
        this.Line = line;
    }
    /**
     * ToString
     */
    Token.prototype.ToString = function () {
        return this.Type + " " + this.Literal + " " + this.Line;
    };
    return Token;
}());
var Scanner = /** @class */ (function () {
    function Scanner(source, delimiter) {
        this._tokens = [];
        this._start = 0;
        this._current = 0;
        this._line = 1;
        this._source = source;
        this._delimiter = delimiter;
    }
    Scanner.prototype.ScanTokens = function () {
        while (!this.IsAtEnd()) {
            this._start = this._current;
            this.ScanToken();
        }
        this._tokens.push(new Token(TokenType.EOF, "end", this._line));
        return this._tokens;
    };
    Scanner.prototype.ScanToken = function () {
        var c = this.Advance();
        switch (c) {
            case this._delimiter:
                this.AddToken(TokenType.COMMA);
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
    };
    Scanner.prototype.Text = function () {
        while (Scanner._reserved.indexOf(this.Peek()) == -1 && this.Peek() != this._delimiter)
            this.Advance();
        this.AddToken(TokenType.STRING);
    };
    Scanner.prototype.Peek = function () {
        if (this.IsAtEnd()) {
            return '\0';
        }
        return this._source[this._current];
    };
    Scanner.prototype.IsAtEnd = function () {
        return this._current >= this._source.length;
    };
    Scanner.prototype.Advance = function () {
        this._current++;
        return this._source[this._current - 1];
    };
    Scanner.prototype.AddToken = function (type) {
        this._tokens.push(new Token(type, this._source.substring(this._start, this._current), this._line));
    };
    Scanner._reserved = ['"', '\r', '\n', '\0'];
    return Scanner;
}());
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this._current = 0;
        this._tokens = tokens;
    }
    Parser.prototype.Parse = function () {
        var rows = [];
        while (!this.IsAtEnd()) {
            rows.push(this.Record());
        }
        return rows;
    };
    Parser.prototype.Record = function () {
        var record = [this.Field()];
        while (this.Match(TokenType.COMMA)) {
            record.push(this.Field());
        }
        if (!this.Match(TokenType.CR_LF, TokenType.LF, TokenType.CR)) {
            throw this.GetError(this.Previous(), "Expect crlf or lf after record.");
        }
        return record;
    };
    Parser.prototype.Field = function () {
        var field = this.NonEscaped();
        if (field == null || field.trim() == '') {
            field = this.Escaped();
        }
        return field;
    };
    Parser.prototype.NonEscaped = function () {
        if (this.Match(TokenType.STRING)) {
            return this.Previous().Literal;
        }
        return "";
    };
    Parser.prototype.Escaped = function () {
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
    };
    Parser.prototype.Match = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        for (var i = 0; i < types.length; i++) {
            if (this.Check(types[i])) {
                this.Advance();
                return true;
            }
        }
        return false;
    };
    Parser.prototype.Check = function (type) {
        if (this.IsAtEnd())
            return false;
        return this.Peek().Type == type;
    };
    Parser.prototype.Advance = function () {
        if (!this.IsAtEnd())
            this._current++;
        return this.Previous();
    };
    Parser.prototype.IsAtEnd = function () {
        return this.Peek().Type == TokenType.EOF;
    };
    Parser.prototype.Peek = function () {
        return this._tokens[this._current];
    };
    Parser.prototype.Previous = function () {
        return this._tokens[this._current - 1];
    };
    Parser.prototype.GetError = function (token, message) {
        return new Error("[line " + token.Line + " ] Error at " + token.Literal + ": " + message);
    };
    return Parser;
}());
var ParseError = /** @class */ (function () {
    function ParseError(token, message) {
    }
    return ParseError;
}());
//# sourceMappingURL=parser.js.map