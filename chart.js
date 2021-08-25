function draw(){
    let canvas = document.getElementById("myCanvas")
    let ctx = canvas.getContext("2d")

    let x = 50
    //let y = 0
    let width = 40
    //let height = 100
    ctx.fillStyle = "red"

    let graphValues = [30, 50, 45, 67, 51, 39]

    for(let i=0; i<graphValues.length; i++){
        var h = graphValues[i]
        ctx.fillRect(x, canvas.height - h, width, h)
        x += width + 15;
    }
}