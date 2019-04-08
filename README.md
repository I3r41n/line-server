# line-server
System act as a network server that serves individual lines of an immutable text file over the network to clients using a simple REST API

## Requirements
- API ENDPOINT - GET /lines/<line index> : Returns an HTTP status of 200 and the text of the requested line or an HTTP 413 status if the requested line is beyond the end of the file.
- Multiple simultaneous clients.
- Perform well for small and large files.
- Perform well as the number of GET requests per unit time increases.
- Avoid putting the file contents into a database
- The file maybe pre-process and has the following properties
  1 - Each line is terminated with a newline ("\n")
  2 - Any given line will fit into memory.
  3 - The line is valid ASCII (e.g. not Unicode).

## Thought Process
- The solution should be stateless so we could scale horizontally (in a real environment, it would clearly be a cluster being a load balancer to respond to this .. scaling with the request increase/decrease
- Even without the database, an index of some sort is needed to rapidly find the content to return to the request 
- Two ideas for the preprocessment/data lookup:
  1. Slip the N lines file into N files with 1 line where the name will be the line number.
  2. Locate the '\n' chars and store their position, finding a way to seek its position without loading the whole file into memory
- The first idea sounds a pretty naive approach on my side, having more files will take more space and more filepointers at a time, furthermore I think it is worse I/O wise (need to check this..)
- The second will require to load in memory an array (each position is the line..don't forget it 0 base :)), so N memory positions for an N line file.. In ES6, the Number.MAX_SAFE_INTEGER is 9007199254740991 ... should be enough :). 
- The preprocessment will require to load the file to memory.. ideally it will be as a stream so it isn't full loaded at the same time.. chunks please
- Seems that event-stream lib should be appropriate for this challenge

## Questions to answer
### 1. How does your system work? (if not addressed in comments in source)
### 2. How will your system perform with a 1 GB file? a 10 GB file? a 100 GB file?
### 3. How will your system perform with 100 users? 10000 users? 1000000 users?
### 4. What documentation, websites, papers, etc did you consult in doing this assignment?
  * To remind myself to use stream - https://stackabuse.com/read-files-with-node-js/ and https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93
  * Comparing the nodeJs read methods and event-stream lib https://itnext.io/streams-for-the-win-a-performance-comparison-of-nodejs-methods-for-reading-large-datasets-pt-2-bcfa732fa40e?sk=11818162d84e2888187ed2b57b9e0118
  * Memory usage - https://medium.com/@dalaidunc/fs-readfile-vs-streams-to-read-text-files-in-node-js-5dd0710c80ea
  * Event-stream lib: https://thlorenz.com/blog/the-power-of-nodejs-streams-and-the-event-stream-module/
### 5. What third-party libraries or other tools does the system use? How did you choose each library or framework you used?
  * _Docker_ - To containerize my application and make sure there aren't SO differences 
  * _Node_ - No special reason apart that I been using it for a bit now (it probably isn't the best tool for the job)
  * _Yarn_ - I find Yarn faster than NPM and the usage of Yarn lock is pretty straight forward (although NPM now has the same funcionality I still haven't return to it)
  * _Typescript_ - As Node/Javascript it been my professional tool for a while now, and if i'm gonna do it on Node/Javascript it is a mandatory requirement for me.
  * _Express_ - Node most used web framework for Node. The mainly reason is familiarity and being an non oficial Node Standard 
  * _Jest_ - TDD is a way of work that i'm a strong supporter and Jest has became my favorite testing environment on Javascript development.
### 6. How long did you spend on this exercise? If you had unlimited more time to spend on this, how would you spend it and how would you prioritize each item?
### 7. If you were to critique your code, what would you have to say about it? 
  1. The archicteture - knowing it wasn't a production ready code and the goal of the exercise, I didn't took much tought about the archicteture. On a real production ready system, I would have separated the modules better and never call the logic directly in the router (for instance, i'd use an Adapter/Port archicteture)
  2. The usage os stream are probably subpair, I never used them before in Node, and I feel like the code isn't as clean as it should 
  3. Althouth I did TDD (as my usual beheviour), I feel like maybe one more tests are missing (probably empty lines or missing \n..)
