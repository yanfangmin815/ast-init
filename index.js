const parse = require('@babel/parser').parse;
const t = require('@babel/types');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default

const code = `
        function AA() {
            console.log('this is declare')
        }
       `;
const ast = parse(code);

const generatorNumber = function() {
    // 1.生成数字 1
    const number = t.numericLiteral(1);
    // 2.生成二元表达式 1 + 1
    const exp = t.binaryExpression('+', number, number);
    // 3.生成变量 a
    const varible = t.identifier('a');
    // 4.生成变量声明 a = 1 + 1
    const declarations = t.variableDeclarator(varible, exp);
    // 5.生成变量声明 const a = 1 + 1
    const content = t.variableDeclaration('const', [declarations]);
    return content
}

/**
 * id, 
 * params, 
 * body,
 * generator,
 * async
 */
const generatorVariableDeclaration = function() {
    /**
     * object: required
     * property: required
     */
    const Identifier1 = t.identifier('console')
    const Identifier2 = t.identifier('log')
    const memberExpression = t.memberExpression(Identifier1, Identifier2)
    /**
     * callee: required
     * arguments: required
     */
    const StringLiteral = t.stringLiteral('HELLO AST!!')
    const callExpression = t.callExpression(memberExpression, [StringLiteral])
    const expressionStatement = t.expressionStatement(callExpression)
    const blockStatement = t.blockStatement([expressionStatement])
    /**
     * id: Identifier (default: null)
     * params: Array<LVal> (required)
     * body: BlockStatement (required)
     */
    const variable1 = t.identifier('BB');
    const variable2 = t.identifier('CC');
    const params = [variable1, variable2]
    const functionExpression = t.functionExpression(null, params, blockStatement)
    /**
     * id: LVal (required)
     * init: Expression (default: null)
     */
    const variable = t.identifier('aa');
    const variableDeclarator = t.variableDeclarator(variable, functionExpression)
    /**
     * kind: "var" | "let" | "const" (required)
     * declarations: Array<VariableDeclarator> (required)
     */
    const variableDeclaration = t.variableDeclaration('const', [variableDeclarator])
    return variableDeclaration
}

const generateTryStatementBlockStatement = function() {
    // param-1
    /**
     * object: required
     * property: required
     */
    const identifier = t.identifier('console')
    const identifier1 = t.identifier('log')
    const memberExpression = t.memberExpression(identifier, identifier1)
    const StringLiteral = t.stringLiteral('HELLO AST!!')
    /**
     * callee: required
     * arguments: required
     */
    const callExpression = t.callExpression(memberExpression, [StringLiteral])
    const expressionStatement = t.expressionStatement(callExpression)
    /**
     * body: Array<Statement> (required)
     * directives: Array<Directive> (default: [])
     */
    const blockStatement = t.blockStatement([expressionStatement]) // param-1
    return blockStatement
}

const generateCatchClause = function() {
    // param-2
    const identifier3 = t.identifier('err')
    const identifier1 = t.identifier('console')
    const identifier2 = t.identifier('log')
    const memberExpression = t.memberExpression(identifier1, identifier2)
    /**
     * operator: "+" | "-" | "/" | "%" | "*" | "**" | "&" | "|" | ">>" | ">>>" | "<<" | "^" | "==" | "===" | "!=" | "!==" | "in" | "instanceof" | ">" | "<" | ">=" | "<=" (required)
     * left: Expression (required)
     * right: Expression (required)
     */
    const StringLiteral = t.stringLiteral('err is:')
    const identifier = t.identifier('err')
    const binaryExpression = t.binaryExpression('+',StringLiteral, identifier)
    /**
     * callee: required
     * arguments: required
     */
    const callExpression = t.callExpression(memberExpression, [binaryExpression])
    const expressionStatement = t.expressionStatement(callExpression)

    const blockStatement = t.blockStatement([expressionStatement])
    const catchClause = t.catchClause(identifier3, blockStatement) // param-2
    return catchClause
}

const generateBlockStatement2 = function() {
     // param-3
     const identifier = t.identifier('console')
     const identifier1 = t.identifier('log')
     const memberExpression = t.memberExpression(identifier, identifier1)
    
     const StringLiteral = t.stringLiteral('exec finally')
     /**
      * callee: required
      * arguments: required
      */
     const callExpression = t.callExpression(memberExpression, [StringLiteral])
     const expressionStatement = t.expressionStatement(callExpression)

     const blockStatement = t.blockStatement([expressionStatement])
     return blockStatement
}


/**
 * 
 */
const generateTryStatement = function() {
    const tryStatementBlockStatement = generateTryStatementBlockStatement()
    const catchClause = generateCatchClause()
    const blockStatement2 = generateBlockStatement2()
    /**
     * block: BlockStatement (required)
     * handler: CatchClause (default: null)
     * finalizer: BlockStatement (default: null)
     */
    const tryStatement = t.tryStatement(tryStatementBlockStatement, catchClause, blockStatement2)
    return tryStatement
}

/**
 * 便于理解我一步步拆解，这个其实就是拆解代码的逆过程
 * 刚接触的话可以根据ast explore中生成的语法树中的type,
 * 去到@babel/type中查找相应type,会有相应的方法和入参说明
 */
// 生成const a  = 1 + 1;
const content = generatorNumber()
// 生成函数声明
const variableDeclaration = generatorVariableDeclaration()
// 为函数包裹try...catch...finally
const tryStatement = generateTryStatement()
const functionDeclaration = t.functionDeclaration(
    t.identifier('AA'), [], t.blockStatement([tryStatement]))
// 将内容放入body中
ast.program.body.push(content);
ast.program.body.push(variableDeclaration);
ast.program.body.push(functionDeclaration);

// 改 - 向数组中添加属性
const property = t.objectProperty(t.identifier('c'), t.stringLiteral('c'));
traverse(ast, {
      Program: {
        exit(path) {
              // 设置输出格式
            const output = generate(ast, { 
                quotes: 'single', 
                retainLines: false, 
                compact:false,
                concise: true
            });
            // console.log(output, '>>>>>>>>>>>>')
        }
    },
    ObjectExpression(path) {
        console.log(path, 'ObjectExpression');
        if (path.parent.id.name == 'obj') {
            path.pushContainer('properties', property);
        }
        // path.pushContainer('properties', property);
    },
    FunctionDeclaration(path) {
        console.log(path, 'FunctionDeclaration');
        // const number = t.numericLiteral(1);
        // path.pushContainer('params', number);
    },
    VariableDeclaration(path) {
        // console.log(path, 'VariableDeclaration');
    },
    ExpressionStatement(path) {
        const tryStatement = generateTryStatement()
        // const blockStatement2 = generateBlockStatement2()
        /**
         * block: BlockStatement (required)
         * handler: CatchClause (default: null)
         * finalizer: BlockStatement (default: null)  , blockStatement2
         */
        // const rtn = t.returnStatement(t.binaryExpression('+', t.stringLiteral('hello'), t.identifier('v')))
        // path.replaceWith(rtn)
        path.replaceWith(tryStatement)
    }
});

