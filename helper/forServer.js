const randomNumber = ()=>{
    let rnd = Math.floor(Math.random()*1000)
    let strRnd = '0'
    if(String(rnd).length<4){
        for(let i=0; i<(String(rnd).length<4); i++){
            strRnd += "0"
        }
        return (strRnd+rnd)
    }
        
    return String(rnd)
}
export {randomNumber}