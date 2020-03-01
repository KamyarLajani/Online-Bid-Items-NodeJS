# Online bid item Nodejs application

This app is developed with Node.js and MongoDB, WS(Websocket) library.
Online bidding items, with timer limits.


![demo](biddingmini.gif)   

### features:

Add item to the bids queue with a date to bid be started  
Only logged in users can bid the items  
Bonus time after first timer  
Bid place when a new bid added and the bid timer will renwed  
A new bid must be more than the previous bids  
Show previous bids for users  
Item replace when a new item added in to DB and the time of the new item is less than the idle item  
Item replace only happens when the bid time not started  
Item can be sold or not  
Next item and repeat to check a new item in queue or DB  
User profile   
Last/Highest bid are chosen and be saved in DB with the bidder information  
Users can see their items and the status of the items, like (In queue, Sold, Not sold)  
If an item sold, user can see the bidder(last bid) user information and contact him/her  





### Full video

[Youtube](https://www.youtube.com/watch?v=ASmErK8-OSc)

