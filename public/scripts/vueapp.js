
function buttons(e) {
			
    let id = e.id;
    let circlesBtn = document.querySelectorAll('.circle span');
    let images = document.querySelectorAll('.images img');
    if(id > 0) {
        app.$data.leftArrow = true;
    }
    else {
        app.$data.leftArrow = false;
    }
    if(id < circlesBtn.length-1) {
        app.$data.rightArrow = true;
    }
    else {
        app.$data.rightArrow = false;
    }
    for(let i = 0; i < images.length; i++) {
        images[i].className = '';
        circlesBtn[i].className = '';
    }
    images[id].className = 'show';
    e.className = 'btnShow';
}

app = new Vue({
    mounted() {
        
        var images = document.querySelectorAll('.images img');
        let circlesBtn;
        for(let i= 0; i< images.length; i++) {
            // adding circle buttons
            if(i===0) {
                document.querySelector('.circle').innerHTML += `<span id="${i}" class="btnShow"></span>`;
                images[i].className = 'show';
            }
            else {
                document.querySelector('.circle').innerHTML += `<span id="${i}"></span>`;
            }
            
            circlesBtn = document.querySelectorAll('.circle span');
            circlesBtn[i].setAttribute('onclick', 'buttons(this)');
            // adding id for each image
            images[i].setAttribute('id', i);
            // disable draggable of images
            images[i].setAttribute('draggable', 'false');
        }
        this.autoPlay();
        
    },
    el: '#app',
    data: {
        leftArrow : false,
        rightArrow: true,
        mouseDowned: false,
        mouseDownx: 0,
        mouseUpped: false,
        mouseUpX: 0,
        mouseMoveX: 0,
        autoPlayed: true,
        
    },
    methods: {
        next: function() {
            let ele = document.querySelector('.show');
            let circlesBtn = document.querySelectorAll('.circle span');
            let allEles = document.querySelectorAll('.images img');
            let length = allEles.length;
            this.leftArrow = true;
            // if current image and circle button is in the last
            if(ele.nextElementSibling !== null){
                if(ele.nextElementSibling.id == allEles[length-1].id) {
                    this.rightArrow = false;
                }
                circlesBtn[parseInt(ele.id)+1].className = 'btnShow';
                circlesBtn[parseInt(ele.id)].className = '';
                ele.className = '';
                ele.nextElementSibling.className = 'show';
            }
            
                
        },
        previous: function() {
            let ele = document.querySelector('.show');
            let circlesBtn = document.querySelectorAll('.circle span');
            let allEles = document.querySelectorAll('.images img');
            let length = allEles.length;
            this.rightArrow = true;
            // if current image and circle button is in the first
            if(ele.previousElementSibling !== null){
                if(ele.previousElementSibling.id == allEles[0].id) {
                    this.leftArrow = false;
                    circlesBtn[0].className = 'btnShow';
                }
                else {
                    circlesBtn[parseInt(ele.id)-1].className = 'btnShow';
                }
                circlesBtn[parseInt(ele.id)].className = '';
                ele.className = '';
                ele.previousElementSibling.className = 'show';
            }
        },
        
        ifTouched: function(event, touched){
            // if mobile devices
            if(touched == 'touched') {
                let rect = event.target.getBoundingClientRect();
                let x = event.targetTouches[0].pageX - rect.left;
                return event.offsetX = x;
            }
            else {
                return event.offsetX;
            }
        },
        mouseDown: function(e, touched) {
            this.mouseDownx = this.ifTouched(e, touched);
            this.mouseDowned = true;
        },
        mouseMove: function(e, touched){
            let image = document.querySelector('.show');
            image.style.left = 0;
            // mouse down should be fired before mouse move
            if(this.mouseDowned){
                image.style.left = `${this.ifTouched(e, touched) -  this.mouseDownx}px`;
            }
        },
        mouseUp: function(e){
            let image = document.querySelector('.show');
            image.style.left = 0;
            this.mouseDowned = false;
            this.mouseUpX = e.offsetX;
            let sliderWidth = document.querySelector('.slider').clientWidth;
            // if image pulled/dragged from right to left
            if(this.mouseDownx > this.mouseUpX){
                this.next();
                
            }
            // if image pulled/dragged from left to right
            else if(this.mouseDownx < this.mouseUpX){
                this.previous();
            }
            // if not pulled/dragged, only clicked
            else {
                // if the click position is in the right side of the slider
                if(this.mouseDownx >= sliderWidth/2){
                    this.next();
                }
                // if the click position is in the left side of the slider
                else {
                    this.previous();
                }
            }
        },
        autoPlay: function(){
            this.autoPlayed = true;
            // for each 5sec
            let interval = setInterval(auto, 5000);
            let image = document.querySelector('.show');
            let allEles = document.querySelectorAll('.images img');
            let length = allEles.length;
            let circlesBtn = document.querySelectorAll('.circle span');
            function auto() {
                if(app.$data.autoPlayed) {
                    let image = document.querySelector('.show');
                    let circleShow = document.querySelector('.btnShow');
                    // if current image in the last
                    if(image.id == allEles[length-1].id) {
                        image.className = '';
                        allEles[0].className = 'show';
                        circleShow.className = '';
                        circlesBtn[0].className = 'btnShow';
                        app.$data.leftArrow = false;
                        app.$data.rightArrow = true;
                        
                    }
                    else {
                        app.next();
                        app.$data.leftArrow = true;
                    }
                }
                else {
                    clearInterval(interval);
                }
            }
        },
        pause: function() {
            this.autoPlayed = false;
        }
    }
});