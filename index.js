const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
    constructor(x, y, radius, color){
        this.color = color
        this.radius = radius
        this.x = x
        this.y = y
    }

    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
    }
}

const x =  canvas.width/2
const y = canvas.height/2
const player = new Player(x,y, 15, 'white')
player.draw()

class ProjecTile extends Player {
    constructor(x, y, radius, color, velocity){
        super()
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    update(){
        this.draw()
        this.x = this.x+this.velocity.x
        this.y = this.y+this.velocity.y
    }
}

const projectiles = []
const enemies = []

let animationId
function animate(){
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach((proj, ip) => {
        proj.update()
        if(proj.x + proj.radius < 0 ||
           proj.x - proj.radius > canvas.width ||
           proj.y + proj.radius < 0 ||
           proj.y - proj.radius > canvas.height){
            setTimeout(() => {
                projectiles.splice(ip, 1)
            }, 0)
        }
    })
    enemies.forEach((enemy, i) => {
        enemy.update()
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if(dist - enemy.radius - player.radius < 1){
            setTimeout(() => {
                cancelAnimationFrame(animationId)
            }, 0)
        }

        projectiles.forEach((proj, ip) => {
            const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y)
            if(dist - enemy.radius - proj.radius < 1){
                if(enemy.radius - 10 > 10){
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                } else {
                    setTimeout(() => {
                        enemies.splice(i, 1)
                        projectiles.splice(ip, 1)
                    }, 0)
                }
            }
        })


    })
}


window.addEventListener('click', (event) => {
    event.preventDefault()
    const angle = Math.atan2(event.clientY-canvas.height/2, event.clientX-canvas.width/2)
    const velocity = {
        x: Math.cos(angle)*4,
        y: Math.sin(angle)*4
    }
    const projectile = new ProjecTile(x, y, 5, 'white', velocity)
    projectiles.push(projectile)
    
})

class Enemy extends ProjecTile {
    constructor(x, y, radius, color, velocity){
        super(x, y, radius, color, velocity)
    }
}

function spawnEnemies(){
    setInterval(() => {
        const radius = Math.random() * (40 - 10) + 10
        let x
        let y
        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = `hsl(${Math.random()*360}, 50%, 50%)`
        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2-x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x,y,radius,color,velocity))
    }, 1000)
}
animate()
spawnEnemies()