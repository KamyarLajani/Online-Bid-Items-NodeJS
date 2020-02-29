
class ClassAction {
    constructor(){
        this.reBidStart = false;
        this.mode = '';
    }
     timer(i, type){
        let activeBorder = $("#activeBorder");
        
        if(this.reBidStart){
            window.clearInterval(timerId);
        }
        window.timerId = setInterval(timerStart, 30);
         function timerStart(){
            this.reBidStart = false;
             // stop the timer when bid placed
             if(type == 'bidPlaced') {
                window.clearInterval(timerId);
             }
            let prec, degs = 360;
            
            if(i > degs) {
                window.clearInterval(timerId);
            }
                
            if (i < 0)
                i = 0;
            if (i > degs)
                i = degs;
            prec = (100*i)/360;   
            if (i<=180){
                if(type == 'bidStart'){
                    activeBorder.css('background-color', '#39B4CC');
                    activeBorder.css('background-image','linear-gradient(' + (90+i) + 'deg, transparent 50%, #A2ECFB 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)');
                    
                }
                else if(type == 'bonusStart'){
                    activeBorder.css('background-color', 'orange');
                    activeBorder.css('background-image','linear-gradient(' + (90+i) + 'deg, transparent 50%, #ddd0b9 50%),linear-gradient(90deg, #ddd0b9 50%, transparent 50%)');
                }
            }
            else {
                if(type == 'bidStart'){
                    activeBorder.css('background-color', '#39B4CC');
                    activeBorder.css('background-image','linear-gradient(' + (i-90) + 'deg, transparent 50%, #39B4CC 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)');
                }
                else if(type == 'bonusStart') {
                    activeBorder.css('background-color', 'orange');
                    activeBorder.css('background-image','linear-gradient(' + (i-90) + 'deg, transparent 50%, orange 50%),linear-gradient(90deg, #ddd0b9 50%, transparent 50%)');
                }
            }
            i++;
         }
        
    }

    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    sendBid(){
        let input = $('.add-bid input[type="number"]');
        let errorEle = $('.add-bid p.error');
        if(parseInt(input.val()) <= parseInt(input.attr('min'))){
            errorEle.html('Your entered price must be more than the current price');
        }
        //else if(this.mode == 'bidStart' || this.mode == 'bonusStart'){
            errorEle.html('');
            input.attr('min', `${input.val()}`);
            socket.send(JSON.stringify({type: 'addBid', price: parseInt(input.val())}));
        //}
    }

     getTimeRemaining(endtime){
        let t = endtime - new Date().getTime();
        let seconds = Math.floor( (t/1000) % 60 );
        let minutes = Math.floor( (t/1000/60) % 60 );
        let hours = Math.floor( (t/(1000*60*60)) % 24 );
        let days = Math.floor( t/(1000*60*60*24) );
        return {
          'total': t,
          'days': days,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
        };
      }
    initializeClock(endtime){
        let clock = document.getElementById('endtime');
        window.timeinterval = setInterval(function(){
          let t = obj.getTimeRemaining(endtime);
          clock.innerHTML = `${t.days}:${t.hours}:${t.minutes}:${t.seconds}`;
          if(t.total<=0){
            window.clearInterval(timeinterval);
          }
        },1000);
      }
    clockAudio(type){
        let ele = document.getElementById("clockAudio"); 
        ele.loop = true;
        if(type == 'play'){
            ele.autoplay = true;
            ele.load();
        }
        else
            ele.pause(); 
    }
    bonusTimeAudio(type){
        let ele = document.getElementById("bonusTimeAudio"); 
        ele.autoplay = true;
        ele.load(); 
    }
    itemSoldAudio(type){
        let ele = document.getElementById("itemSoldAudio"); 
        ele.autoplay = true;
        ele.load(); 
    }
    nextItemAudio(type){
        let ele = document.getElementById("nextItemAudio"); 
        ele.autoplay = true;
        ele.load(); 
    }
    bidPlacedAudio(type){
        let ele = document.getElementById("bidPlacedAudio"); 
        ele.autoplay = true;
        Audio.currentTime = 0; 
        ele.load(); 
    }
    
}
    
let obj = new ClassAction();
let activeBorder = $("#activeBorder");
let circleContent = $(".circle-content");
let socket = new WebSocket('ws://localhost:8080');
socket.onopen = ()=>{
    console.log('connected to the server');
}
socket.onmessage = function (event) {
    let parsed = JSON.parse(event.data);
    let input = $('.add-bid input[type="number"]');
    let previousBids = $('.previous-bids .content');
    switch(parsed.type){
        case 'itemPlaced':
            setTimeout(() => {
                location.reload();
            }, 1000);
        break;
        case 'inWait':
            obj.mode = 'inWait';
            document.querySelector('.circle-bid').style.backgroundColor = '#E6F4F7';
            activeBorder.css('background-color', '#39B4CC');
            activeBorder.css('background-image','linear-gradient(90deg, transparent 50%, #A2ECFB 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)');
            circleContent.html(`<h6>Bid starts in:</h6><h5 id='endtime'></h5>`);
            obj.initializeClock(parsed.content.currentItem[0].start_bid_date);
        break;
        case 'bidStart':
            obj.mode = 'bidStart';
            document.querySelector('.circle-bid').style.backgroundColor = '#E6F4F7';
            obj.timer(parsed.content.degree, parsed.type);
            activeBorder.css('background-color', '#39B4CC');
            activeBorder.css('background-image','linear-gradient(90deg, transparent 50%, #A2ECFB 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)');
            circleContent.html(`<p>Current Price: </p> <p style="font-weight: bold;">${parsed.content.current_price}$</p>`);
            obj.clockAudio('play');
            break;
        case 'bonusTime':
            obj.mode = 'bonusTime';
            document.querySelector('.circle-bid').style.backgroundColor = '#E6F4F7';
            activeBorder.css('background-color', 'orange');
            activeBorder.css('background-image','linear-gradient(' + 0 + 'deg, transparent 50%, orange 50%),linear-gradient(90deg, orange 50%, transparent 50%)');
            circleContent.html('<h5>Bonus time!</h5>');
            obj.clockAudio('pause');
            obj.bonusTimeAudio('play');
            break;
        case 'bonusStart':
            obj.mode = 'bonusStart';
            document.querySelector('.circle-bid').style.backgroundColor = '#E6F4F7';
            obj.timer(parsed.content.degree, parsed.type);
            circleContent.html(`<p>Current Price: </p> <p style="font-weight: bold;">${parsed.content.current_price}$</p>`);
            obj.clockAudio('play');
            break;
        case 'itemSold':
            obj.mode = 'itemSold';
            document.querySelector('.circle-bid').style.backgroundColor = 'orange';
            circleContent.html('<h5>Item sold!</h5>');
            obj.clockAudio('pause');
            obj.itemSoldAudio('play');
            break;
        case 'nextItem':
            obj.mode = 'nextItem';
            document.querySelector('.circle-bid').style.backgroundColor = '#E6F4F7';
            circleContent.html('<h5>Next item</h5>');
            obj.clockAudio('pause');
            obj.nextItemAudio('play');
            socket.close();
            setTimeout(() => {
                location.reload();
            }, 4000);
            break;
        case 'bidPlaced':
            obj.mode = 'bidPlaced';
            obj.reBidStart = true;
            document.querySelector('.circle-bid').style.backgroundColor = '#04d3ff';
            window.clearInterval(timerId);
            circleContent.html('<h4>Bid placed</h4>');
            input.attr('min', parsed.content.current_price);
            let content = previousBids.html();
            previousBids.html(`<div><p>${parsed.content.previousBidsUser[0].address}</p><h6>${parsed.content.current_price}$</h6></div>${content}`);
            obj.clockAudio('pause');
            obj.bidPlacedAudio('play');
            break;
    }
};

