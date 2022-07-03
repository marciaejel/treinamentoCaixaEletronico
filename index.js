const inquirer = require("inquirer")

const fs = require('fs')

console.log ("Você está no banco Tem Futuro")

operacao()

function operacao(){
 
    inquirer.prompt([

        {

             type: 'list',
             name: 'action',
             message: "O que você deseja fazer?",
             choices: ['Abrir Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],

            }
    ]).then ((answer) => {
        const action = answer['action']

        if(action === 'Abrir Conta'){
            abrirConta()
        }else if(action ==="Depositar"){
            depositar()
        }else if(action ==="Consultar Saldo"){

        }else if(action ==="Sacar"){

        }else if(action ==="Sair"){
            console.log("Obrigado! Foi um prater tê-lo conosco!")
            process.exit
        }

    }).catch(err => console.log(err))
   
   
}

function abrirConta(){
    console.log ("Bem-vindo! Em poucos minutos abriremos sua conta. Informe os dados solicitados")
    dadosConta()
}

function dadosConta(){
    inquirer.prompt([
        {
            name: 'nomeConta',
            message: 'Digite seu nome completo:',
            
        },

        {
            name: 'numerocpf',
            message: 'Digite seu CPF:',
            
        },
        {
            name: 'numerorg',
            message: 'Digite seu RG:',
            
        },
        {
            name: 'datanascimento',
            message: 'Digite sua data de nascimento:',
            
        },

        {
            name: 'endereco',
            message: 'Digite seu endereço:',
            
        },
         {
            name: 'telefone',
            message: 'Digite seu telefone:',
            
        }
        

    ]).then(answer =>{
       
        const nomeConta = answer ['nomeConta']

        if (!fs.existsSync('contas')){
            fs.mkdirSync('contas')
        }
        
        if(fs.existsSync(`contas/${nomeConta}.json`)){
            console.log("Já existe uma conta com esse nome")
            abrirConta()
        }
         fs.writeFileSync(`contas/${nomeConta}.json`,'{"saldo": 0}')

        operacao()

    }).catch(err => console.log(err))
    
}

function verificaConta (nomeConta){
    var flag = false
    if (fs.existsSync(`contas/${nomeConta}.json`)){
        console.log("Conta verificada")
        flag = true
    }else{
        console.log("Essa conta não foi encontrada. Favor conferir os dados!")
        flag = false
    }
    return flag
}

function depositar (){
    inquirer.prompt([{
        name:'nomeConta',
        message:'Qual é o nome da sua conta?'

    }]).then((answer) =>{
        const nomeConta = answer['nomeConta']
        if (verificaConta(nomeConta)){
         //Se a conta dor verificada pergunta qual é o valor do depósito
            inquirer.prompt([{
                name:'valor',
                message:'Qual é o valor que deseja depositar?'
            }]).then((answer)=>{
                const valor = answer['valor']
                adicionarValor(nomeConta, valor);
                operacao()

            }).catch(err =>console.log(err))


        }else{
            depositar();
            //se for verdadeiro cai no depositar
        }  
    })
}

// essa função pega o valor da conta 
function getConta(nomeConta){
    const contaJSON = fs.readFileSync(`contas/${nomeConta}.json`,{
        encoding: 'utf8',
        flag:'r',
})
return JSON.parse(contaJSON)
}
function adicionarValor(nomeConta,valor){
    const conta = getConta(nomeConta);

    if(conta){
        console.log("Conta não encontrada")
        return depositar()
    }
    conta.saldo = parseFloat(valor) + parseFloat(conta.saldo)

    fs.writeFileSync(
        `contas/${nomeConta}.json`,
        JSON.stringify(conta),
        function(err){
            console.log(err)
        }

    )
}

