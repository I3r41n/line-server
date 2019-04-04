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

## Questions to answer
1. How does your system work? (if not addressed in comments in source)
2. How will your system perform with a 1 GB file? a 10 GB file? a 100 GB file?
3. How will your system perform with 100 users? 10000 users? 1000000 users?
4. What documentation, websites, papers, etc did you consult in doing this assignment?
5. What third-party libraries or other tools does the system use? How did you choose each library or framework you used?
6. How long did you spend on this exercise? If you had unlimited more time to spend on this, how would you spend it and how would you prioritize each item?
7. If you were to critique your code, what would you have to say about it?
