# To do list back end

> The back end used by my to do list :
> https://github.com/NamReact/To-do-list2.0/

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Features](#features)
- [Status](#status)

## General info

Support everything from the to do list.

## Technologies

- body-parser - version 1.19.0
- cors - version 2.8.5
- express - version 4.17.1
- js-sha256 - version 0.9.0
- mongoose - version 5.5.15
- nodemailer - version 6.2.1
- uid2 - version 0.0.3

## Setup

Clone the repository then install the dependencies using `npm install`.

Make sure nothing is running on your port 3001.

Use `npm start`to launch the website.

You can also send request to the API using the URL :

https://todolist-nam-back.herokuapp.com/

## Features

- Register new user.
- Check user login informations and return token.
- Send email to user's email upon successfully creating a new account, changing password.
- Forgot my password route send an email to the user to change password without having a token on the pc.
- Create new task.

### Possible improvement

Add model and route for the project management function

## Status

Project is _in progress_.
