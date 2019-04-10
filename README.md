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
  * The system can be built using the build.sh script, which will create a docker image with the app. 
  * The run.sh accepts a filename, that is expected to be under the ~/data directory. The script reads from the filename and passes it to the docker run command. 
  * The docker command creates a volume to ~/data directory (so it is required to place the file to read under that directory), setting an enviromnent variable for node with the /data/<filename> value. 
  * The file needs to exist on the ~/data folder, this was a design restriction to ensure docker is able to mount the volume so that the container can access the file
  * The file is preprocessed creating an in memory array with the '\n' positions in the file, or in other words the final position of the Nth line is in the Nth position of the array.
  * When a request is made to the route '/lines/<line index>', the line position is looked up in the array (since the array 0 position has the value 0, the line index is the correct position for end of the line).
  * With the start and end position, a stream from the file is created with just the line content and returned directly to the http response.
  * If the position is higher than the array length an 413 is returned.
  
### 2. How will your system perform with a 1 GB file? a 10 GB file? a 100 GB file?
  * Following the information I researched (see question 4), the way streams work (reading chunk by chunk) and specially how event-stream works, reading the file seems to be more or less a non issue. Of course, the preprocessing would take longer with bigger files, but since it's done before the server is up it wouldn't impact the performance.
  * The number of lines on another hand, will have a direct impact on the memory used, since we store each '\n' position but the access to those position is O(1) so it's a cheap trade to do (unless we have a file with only newlines, that would consume all of the memory and break the system...).
  
### 3. How will your system perform with 100 users? 10000 users? 1000000 users?
  * Following my experience, some reading and knowing that the system doesn't do any blocking operations, it is possible that the system can handle 1000000 concurrents requests (with some tweaking on the memory heap for Node). Having the memory well configured would allow Node to properly use the event loop handling tens of thousands of concurrent connections (which I admit, I haven't done for this exercise). 
  * Another subject to take into consideration is the file access. Since it's reading it can be concurrent and with the stream and async logic usage, it shoud accept a large number of concurrent readers. Although the time taken to access the file would be increasing as the concurrent users increase. 
  * Another thing to bear in mind is that the disk I/O can and probably be a bottleneck on the reading.

### 4. What documentation, websites, papers, etc did you consult in doing this assignment?
  * To remind myself to use stream - https://stackabuse.com/read-files-with-node-js/ and https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93
  * Comparing the nodeJs read methods and event-stream lib https://itnext.io/streams-for-the-win-a-performance-comparison-of-nodejs-methods-for-reading-large-datasets-pt-2-bcfa732fa40e?sk=11818162d84e2888187ed2b57b9e0118
  * Memory usage - https://medium.com/@dalaidunc/fs-readfile-vs-streams-to-read-text-files-in-node-js-5dd0710c80ea
  * Event-stream lib: https://thlorenz.com/blog/the-power-of-nodejs-streams-and-the-event-stream-module/
  * Node capabilities - https://medium.com/the-node-js-collection/why-the-hell-would-you-use-node-js-4b053b94ab8e, http://www.sebastianseilund.com/nodejs-async-in-practice
  
### 5. What third-party libraries or other tools does the system use? How did you choose each library or framework you used?
  * _Docker_ - To containerize my application and make sure there aren't SO differences 
  * _Node_ - No special reason apart that I been using it for a bit now (it probably isn't the best tool for the job)
  * _Yarn_ - I find Yarn faster than NPM and the usage of Yarn lock is pretty straight forward (although NPM now has the same funcionality I still haven't return to it)
  * _Typescript_ - As Node/Javascript it been my professional tool for a while now, and if i'm gonna do it on Node/Javascript it is a mandatory requirement for me.
  * _Express_ - Node most used web framework for Node. The mainly reason is familiarity and being an non oficial Node Standard 
  * _Jest_ - TDD is a way of work that i'm a strong supporter and Jest has became my favorite testing environment on Javascript development.
  * _Supertest_ - The motivation with this module is to provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent. 
  
### 6. How long did you spend on this exercise? If you had unlimited more time to spend on this, how would you spend it and how would you prioritize each item?
  * I spent some time studying the best way to read a file in Node (at least what appears to be the best way), probably around 4 non consecutive hours. 
  * For the solution design around 2 hours (although in between during my regular day to day, it was lurking on the back of my mind.
  * For the coding part I'd say another 8 hours where some time was lost between the streams and some Docker/Node debugging.
  * As for the writing, I'd say around 2 hours maybe 3 (documentation isn't one of my best suits).
  * So maybe a total of 16 - 17 hours in total (although it isn't probably measured since I did this during my free time which involves a 3 year old)
  * As for what I would do with unlimited time:
    1. I'd spend some time doing performance testing to verify the assumptions refered in questions 2 and 3. 
    2. Then I'd prioritize the improvements according to it, where i'm sure a cache with the last N requests would must certain appear.
    3. Furthermore, i'd improve the file validation and try to improve the stream usage (cause I'm sure it isn't that good).     4. Another improvement would be with the state of the app (the in memory array), i'd look for something that could be stateless.. so scaling would be easier

### 7. If you were to critique your code, what would you have to say about it? 
  1. The archicteture - knowing it wasn't a production ready code and the goal of the exercise, I didn't took much tought about the archicteture. On a real production ready system, I would have separated the modules better and never call the logic directly in the router (for instance, i'd use an Adapter/Port archicteture)
  2. The usage os stream are probably subpar, I never used them before in Node, and I feel like the code isn't as clean as it should 
  3. Althouth I did TDD (as my usual beheviour), I feel like maybe one more tests are missing (probably empty lines or missing \n..)
  4. Also, I should have done a better check for file existence/access .. throwing an exception (if the argument is invalid) or just letting node explode (if the file doesn't exist) isn't the best solution at all
  5. Although I talked about the solution being stateless it isn't..
