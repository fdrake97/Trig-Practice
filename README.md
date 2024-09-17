Play game at https://burritokitten.github.io/Trig-Dev/welcome.html

Hey there! a few notes about the game:  
Cookies are used to keep track of your name and highscore.  
A 10 second penalty is incurred for pausing to prevent cheating.  
Score is calculated with the following formula:  
> score = (score*0.95 + 100000/(val)*(1+(streak/10)));  

Where val is the time spent on the last problem in ms.  
The program keeps a rolling tally of your score, and when you submit the leaderboard database recalculates your score.