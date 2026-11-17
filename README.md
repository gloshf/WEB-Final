Final Project

MovieVerse

MovieVerse is a movie information website with ratings, trailers, reviews and interactive features.

Group members:

Almadi Askhat 
Amina Toleugazinova 
Saida Amirgaliyeva

Project description

MovieVerse is a responsive website developed through the Midterm, Endterm and Final stages of the Web Technologies course. The project combines a movie catalog, trailer videos, a poster gallery, ratings and reviews. The Final stage adds theme switching, browser-based account functionality, an interactive FAQ and public API integration.

The website contains eight separate pages connected through a navigation bar. HTML provides the page structure, CSS and Bootstrap provide styling and responsive layouts, and JavaScript with jQuery provides interactive behavior.

Website pages

Home, index.html, introduces MovieVerse, highlights selected movies and includes the FAQ section.

Movies, movies.html, contains the movie catalog, live search, genre filters and the Studio Ghibli API section.

Ratings, ratings.html, contains a dynamic table with options to add, edit and delete movie records and restore the initial dataset.

Trailers, trailers.html, presents movie videos with playback controls. Starting one video pauses the other videos.

Reviews, reviews.html, displays sample reviews and allows visitors to add reviews stored in their browser.

Gallery, gallery.html, presents movie posters in a responsive grid with a lightbox, navigation arrows and keyboard controls.

Register, register.html, provides registration with client-side validation, password confirmation and a password strength indicator.

Sign In, login.html, allows users to sign in to an account previously created in the same browser.

Implemented features

Registration checks the name, email, password, password confirmation and message. The email format is checked with a regular expression. Input events provide feedback while the user types, and invalid data prevents submission. The password strength indicator displays weak, medium or strong feedback.

The movie search updates results immediately without reloading the page. Search is case-insensitive and works together with genre filters. The page displays a result counter and a message when no movies match the selected conditions.

The ratings table implements Create, Read, Update and Delete operations. Bootstrap modal forms support adding and editing records. Deletion requires confirmation. Ratings are saved in localStorage and remain available after refreshing the page. Reset restores the initial dataset.

The gallery opens posters in a lightbox with previous and next navigation. Arrow keys change the image and Escape closes the lightbox. jQuery fade effects provide transitions.

Users can submit reviews containing a name, selected movie, rating and review text. New reviews appear on the page and remain available after refreshing the page in the same browser.

The light and dark theme toggle saves the selected theme in localStorage. The saved theme is applied when a page is refreshed or another page is opened.

Registration creates a browser-local account and signs the user in. The navigation displays a greeting with the account name and a Sign Out button while a session is active. Sign In and Register are shown when the user is signed out. The saved login state survives page refreshes, and signing out removes the session.

The FAQ contains six questions about MovieVerse. Answers open and close using jQuery slideToggle animations. Plus and minus indicators show whether an answer is collapsed or expanded.

The Studio Ghibli section requests data from the public Studio Ghibli API using fetch and processes the JSON response. It creates movie cards dynamically and provides search, director filtering, sorting and a refresh option. Error handling displays a message when a request fails.

Technologies used

HTML5, CSS3, CSS Flexbox, CSS Grid, Bootstrap 5.3, JavaScript, jQuery 3.7, Google Fonts Inter, localStorage, the Web Crypto API, the Fetch API, JSON, Git, GitHub and GitHub Pages.

Project files

The main pages are index.html, movies.html, ratings.html, trailers.html, reviews.html, gallery.html, register.html and login.html.

The css folder contains style.css and final-features.css. The js folder contains script.js, theme.js, faq.js, auth.js and api.js. The images and videos folders contain the local media resources.

Individual contributions

Almadi Askhat worked on the registration form, client-side validation, password feedback, navigation updates and README documentation.

Amina Toleugazinova worked on real-time movie search, category filtering, the image gallery, the lightbox and its transitions.

Saida Amirgaliyeva worked on the ratings table, CRUD operations, modal forms, localStorage persistence, responsiveness and visual testing.

The team collaborated on code review, testing, integration and preparing the website for publication.

Local development

Download or clone the repository and serve the project folder using a local HTTP server, such as the Live Server extension in Visual Studio Code. Open index.html through the local server. The project does not require a package installation or build step. Account password processing requires HTTPS or localhost.

Data storage and limitations

Accounts, login state, ratings, reviews and theme preferences are stored in the current browser. They are not synchronized between devices or different website origins. The account system is an educational demonstration without server-side authentication or a shared database. The locally defined movie catalog is separate from the films retrieved through the public API.

AI acknowledgement

ChatGPT was used as a supporting tool for code review, troubleshooting, code suggestions and documentation drafting. The project team is responsible for reviewing, testing and understanding the submitted work.