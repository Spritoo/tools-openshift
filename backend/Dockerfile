#NodeBaseImage
FROM node:18-alpine

#CurrentWorkingDirectory
WORKDIR /app

#Copy PackageJsonFiles Inside Container
COPY package*.json ./

#BashShell
SHELL [ "/bin/bash","-c" ]

#Installing Dependencies
RUN ["npm","install"]

#Copy All BackendFiles Inside Container
COPY . .

#Expose Port
EXPOSE 3000

#Running Application
CMD [ "node","src/server.js" ]

