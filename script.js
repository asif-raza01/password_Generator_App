const inputslider=document.querySelector("[data-lengthslider]");
const lengthdisplay=document.querySelector("[data-lengthNumber]");
const passworddisplay=document.querySelector("[data-passwordDisplay]");
const copybut=document.querySelector("[data-copy]");
const copymsg=document.querySelector("[data-copymsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numberscheck=document.querySelector("#numbers");
const symbolscheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generatebtn=document.querySelector(".generateButton")
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols="!@#$%^&*()_+-=[]{}|;:'`<>,.?/";

let password="";
let passwordlength=10;
let checkcount=0;
handleslider();
setindicator("#ccc")
function handleslider(){
    inputslider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize=((passwordlength-min+0.001)*100/(max-min))+"100%"
}

function setindicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generatenumbers(){
    return getRndInteger(0,9);
}
function generateuppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generatelowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generatesymbols(){
    const rndNum=getRndInteger(0,symbols.length);
    return symbols.charAt(rndNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercasecheck.checked) hasUpper = true;
    if (lowercasecheck.checked) hasLower = true;
    if (numberscheck.checked) hasNum = true;
    if (symbolscheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
      setindicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordlength >= 6
    ) {
      setindicator("#ff0");
    } else {
      setindicator("#f00");
    }
}

async function copycontent() {
    try{
        await navigator.clipboard.writeText(passworddisplay);
        copymsg.innerText="copied";
    }
    catch(e){
        copymsg.innerText="failed";
    }
    copymsg.classList.add("active");
    setTimeout( ()=>{
        copymsg.classList.remove("active");
    },2000);
}
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handlecheckboxchange(){
    checkcount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkcount++;
    });
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleslider();   
    }
}

allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckboxchange);
})
inputslider.addEventListener('input',(e) => {
    passwordlength=e.target.value;
    handleslider();
})

copybut.addEventListener('click',() => {
    if(passworddisplay.value)
        copycontent();
})

generatebtn.addEventListener('click',() =>{
       if(checkcount<=0) return;
       if(passwordlength<checkcount){
            passwordlength=checkcount;
            handleslider(); 
        }
        password="";
        // if(uppercasecheck.checked){
        //     password += generateuppercase();
        // }
        // if(lowercasecheck.checked){
        //     password += generatelowercase();
        // }
        // if(numberscheck.checked){
        //     password += generatenumbers();
        // }
        // if(symbols.checked){
        //     password += generatesymbols();
        // }
        let funcArr = [];
        if(uppercasecheck.checked)
            funcArr.push(generateuppercase);
        if(lowercasecheck.checked)
            funcArr.push(generatelowercase);
        if(numberscheck.checked)
            funcArr.push(generatenumbers);
        if(symbolscheck.checked)
            funcArr.push(generatesymbols);
        for(let i=0; i<funcArr.length; i++) {
            password += funcArr[i]();
        }
        console.log("COmpulsory adddition done");
    
        //remaining adddition
        for(let i=0; i<passwordlength-funcArr.length; i++) {
            let randIndex = getRndInteger(0 , funcArr.length);
            console.log("randIndex" + randIndex);
            password += funcArr[randIndex]();
        }
        console.log("Remaining adddition done");
        //shuffle the password
        password = shufflePassword(Array.from(password));
        console.log("Shuffling done");
        //show in UI
        passworddisplay.value = password;
        console.log("UI adddition done");
        //calculate strength
        calcStrength(); 
});