# README

# Project: JavaScript - Library App #

This is my student solution to The Odin Project's [Library App](https://www.theodinproject.com/lessons/library).  The goal was to create a simple JavaScript-only system for tracking books that would allow a user to add books, delete books, and change their read status.  The new aspect of JavaScript this project introduced was using constructors to create book objects and adding methods to the book prototype that would be accessible by all books.

## Project Post-Mortem ##

This is the first project in the JavaScript-only track of The Odin Project, and I mistakenly assumed it was a small exercise as opposed to a full-scale project.  Because of this, I didn't initialize a GitHub repo for this project until I had already completed most of the functionality, and so my first commit is much larger than I would like.

I began the project by getting user input simply through `prompt()` and using that input to build the Book `constructor`.  I used this input and some static test Books to build a `loop` that would create the necessary DOM elements to display the books on the page.  I refactored the `prompt()` into an HTML form and hooked up the "delete" and "change read status" buttons on individual books.

## Challenges ##

The most difficult area for me was working with the form input in JavaScript: this is not something we'd learned or had to do in The Odin Project previously, and it's not something I've come across while working on other projects.  I tried a lot of different approaches to access the submitted form data in JavaScript and to avoid actually sending the data elsewhere.  `FormData` seemed like it was going to be the right solution, as it provides key : value pairs for form input, but the data was not coming in a readable format initially.  [This Stack Overflow answer](https://stackoverflow.com/a/56857084/12183520) helped me transform the input into workable data.

Another challenging area was connecting the "delete" button to both the related Book object in the myLibrary array, as well as the correct DOM element.  TOP's suggestion was to use the object's index within the array as a `data-attribute` value, but this seemed like it would cause issues very quickly: as soon as an object was deleted from the array, the indexes of the remaining objects would change and would no longer match their `data-attribute` value.  And if you added books after deleting, the new books would potentially take on the index, and thus `data-attribute`, of already-existing objects.  You could re-loop through the remaining objects and reassign their `data-attribute` each time, but this seemed like an unnecessary extra step.  

The solution I opted for was creating a global bookID variable that simply began at 1 and was assigned as `data-id` for each book; then, after a book is assigned an ID, bookID increments by one.  This means that the first book you add has data-id: 1, and the 30th book will have data-id: 30, no matter how many other books you add or delete.    

The final challenge of this project was self-imposed: I chose to work with vanilla HTML/CSS instead of Bootstrap with SCSS, which I've been using this year for professional projects.  I had used Bootstrap so much that I worried I'd forgotten how to build a web page without it, so this was a good refresher.

## Screenshots ##

TBA
![Desktop view screenshot](/images/library_screenshot.png)

## To Do ##

TBA

## Technologies ##

TBA