// Liste d'anime inclu dans le quizz
// 
const animeList=[
    {
        id : 813,
        name : "Dragon Ball Z"
    },
    {
        id : 1735,
        name : "Naruto: Shippuuden"
    },
]

// Indice de la question en cours
let currentQuestion = 0;
//le score
let score = 0;

//liste des réponse

// const listeReponse = [
//     {
//         image:"src/img/senjougahara.png",
//         propositions:["Senjougahara Itagi","Araragi Koyomi","Hanekawa Tsubasa","Araragi Tsukihi"],
//         indice_reponse: 0
//     },
//     {
//         image:"src/img/araragi.png",
//         propositions:["Senjougahara Itagi","Araragi Koyomi","Hanekawa Tsubasa","Araragi Tsukihi"],
//         indice_reponse: 1
//     },
//     {
//         image:"src/img/hanekawa.png",
//         propositions:["Senjougahara Itagi","Araragi Koyomi","Hanekawa Tsubasa","Araragi Tsukihi"],
//         indice_reponse: 2
//     },
//     {
//         image:"src/img/tsukihi.png",
//         propositions:["Senjougahara Itagi","Araragi Koyomi","Hanekawa Tsubasa","Araragi Tsukihi"],
//         indice_reponse: 3
//     },

// ]
// Fetch best anime
async function getCharactersFromAnime(id){
    let data;
    
    
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`)
        
        if(response.status===200){
            let sortedData;
            data = await response.json();
            // console.log(data);
            //filter by favorites
             sortedData = await data.data.sort((a,b) =>{
                return b.favorites - a.favorites;
            })
            console.log(sortedData[0].character.name.split(",").join(""))
            
            
            return sortedData
        }
    } catch (error) {
        console.log(error)
    }
    
} 


function randInt(max){
    return Math.floor(Math.random()*max)
}


// Boutons réponse
// Gestion de la selection d'item de la liste
// highlight la réponse séléctionnée
let currentButtonCheck = 0;
let responses = document.querySelectorAll('.reponse')
responses[currentButtonCheck].classList.add('active')
responses.forEach((response,index,array) =>{
    response.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentButtonCheck != index){
            response.classList.add('active');
            array[currentButtonCheck].classList.remove('active');
            currentButtonCheck = index;
        }  
    })
})

// Afficher la liste des réponses
function afficherReponse(listeReponse){
    responses.forEach((response,index,array) => {
        response.textContent = listeReponse[currentQuestion].propositions[index];
    })
    document.querySelector("#illustration").src = listeReponse[currentQuestion].image
}

// Evenement du bouton valider
// const validerBtn = document.querySelector('#valider')
// let alert = document.querySelector("#msgAlert")
// validerBtn.addEventListener('click', (e) =>{
//     e.target.setAttribute("disabled","")
//     document.querySelector('#next').classList.toggle("invisible",false)
//     alert.classList.toggle('invisible',false)
//     let indiceReponse = listeReponse[currentQuestion].indice_reponse;
//     console.log(indiceReponse)
//     if(currentButtonCheck === indiceReponse ){
        
//         alert.textContent = "Bonne réponse !"
//         alert.classList.toggle('alert-success',true)
//         score++
//     }
//     else{
//         alert.textContent = "Mauvaise réponse !"
//         alert.classList.toggle('alert-danger',true)
//     }
// })



// Bouton next 
// document.querySelector('#next').addEventListener('click', (e)=> {
    
//     currentQuestion++;
    
//     resetVue()
//     if(currentQuestion < listeReponse.length){
//         validerBtn.removeAttribute("disabled")
//         document.querySelector('#next').classList.toggle("invisible",true)
//         alert.classList.toggle('invisible',true)
//         responses[currentButtonCheck].classList.add('active')
//         document.querySelector('#illustration').src = listeReponse[currentQuestion].image
//         afficherReponse()
//     }
//     else{
//         alert.classList.toggle('alert-info',true)
//         alert.textContent = `Votre score est de: ${score} / ${listeReponse.length}`
//         alert.classList.toggle('invisible',false)
//     }
    
    
// })


function resetVue(){
    let alert = document.querySelector('#msgAlert')
    alert.classList.toggle('alert-danger',false)
    alert.classList.toggle('alert-success',false)
    alert.classList.toggle('alert-info',false)
    responses[currentButtonCheck].classList.remove('active')
    currentButtonCheck = 0;
}


// Initialisation 

getCharactersFromAnime(269).then((datas) =>{
    let charactersNameList=[];
    charactersNameList= datas.map((element) => {
        
        // console.log(element.character.name.split(",").join(""))
        
        return element.character.name.split(",").join("");
    })
    // console.log(charactersNameList[0])
    let listeQuestion = [];
    //on récupère que 10 valeurs dans le tableau
    let filteredData = datas.slice(0,10)
    console.log(charactersNameList)
    while(filteredData.length>0){
        let character = filteredData.splice(randInt(filteredData.length),1)[0]
        let characterName = character.character.name.split(',').join('')
        let question = {}
        
        question.image= character.character.images.webp.image_url;
        let propositionList =[]
        
        while(propositionList.length<3){
            let randomCharacterName = charactersNameList[randInt(charactersNameList.length)]
            if(!randomCharacterName.includes(character)){
                propositionList.push(randomCharacterName)
            }
        }
        let randomNumber =randInt(4)
        question.indice_reponse = randomNumber
        propositionList.splice(randomNumber,0,characterName)
        question.propositions=propositionList;
        
        listeQuestion.push(question)
    }
    // console.log(listeQuestion)

    afficherReponse(listeQuestion)
    
    // Bouton valider
    const validerBtn = document.querySelector('#valider')
    let alert = document.querySelector("#msgAlert")
    validerBtn.addEventListener('click', (e) =>{
        e.target.setAttribute("disabled","")
        document.querySelector('#next').classList.toggle("invisible",false)
        alert.classList.toggle('invisible',false)
        let indiceReponse = listeQuestion[currentQuestion].indice_reponse;
        console.log(indiceReponse)
        if(currentButtonCheck === indiceReponse ){
            
            alert.textContent = "Bonne réponse !"
            alert.classList.toggle('alert-success',true)
            score++
        }
        else{
            alert.textContent = "Mauvaise réponse !"
            alert.classList.toggle('alert-danger',true)
        }
    })


    document.querySelector('#next').addEventListener('click', (e)=> {
    
        currentQuestion++;
        
        resetVue()
        if(currentQuestion < listeQuestion.length){
            validerBtn.removeAttribute("disabled")
            document.querySelector('#next').classList.toggle("invisible",true)
            alert.classList.toggle('invisible',true)
            responses[currentButtonCheck].classList.add('active')
            document.querySelector('#illustration').src = listeQuestion[currentQuestion].image
            afficherReponse(listeQuestion)
        }
        else{
            alert.classList.toggle('alert-info',true)
            alert.textContent = `Votre score est de: ${score} / ${listeQuestion.length}`
            alert.classList.toggle('invisible',false)
        }
        
        
    })


})


