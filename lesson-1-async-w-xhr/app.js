(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText = 'computer';
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
    
	/**@description Create a request to Pixabay API (nicer pictures than in unsplash) : 
	* create a new request and open a Get request (don't need to set the request header)
	* if I have a response I add an image
	* if I have nothing, I will prevent the user I have no images for him
	*/
	const pixabayId = '8326628-dc9ac48259cd959e1aeaf66d8';
	const pixabayUrl = `https://pixabay.com/api/?key=8326628-dc9ac48259cd959e1aeaf66d8&q=${searchedForText}&image_type=photo&pretty=true`;
	
	const pixabayRequest = new XMLHttpRequest();
	pixabayRequest.open('GET', pixabayUrl);
	pixabayRequest.onload = addImage;
	pixabayRequest.onerror = function(err) {
		sendError(err, 'images');
	};
	pixabayRequest.send();

	function addImage() {
	let htmlContent;
	const data = JSON.parse(this.responseText);
	// if I can translate JSON response from unsplash to a Javascript object, and if I can get the first image
	if(data.hits && data.hits[0]) {
		const firstImage = data.hits[0];
		htmlContent = `<figure>
		<img src='${firstImage.webformatURL}' alt='${firstImage.description}'>
		<figcaption>${firstImage.tags}</figcaption>
		</figure>`;
		responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
	} else {
		const noImages = `<h3>Sorry guys...</h3>
		<p>No images about ${searchedForText}, try again...</p>`;
		responseContainer.insertAdjacentHTML("afterbegin", noImages);
	}
};

	/**@description Send an error message and tell which part I need to change in the text (articles or images) 
	* @param error - Error message 
	* @param part - Part of the text I need to change (articles OR images)
	*/
	function sendError(error, part) {
	const text = `<h3>Sorry guys...</h3>
		<p>No ${part} about ${searchedForText}, try again...</p>`;
	console.log(error);
	responseContainer.insertAdjacentHTML("afterbegin", text);
	};

	
	/**@description Create a request to NY Times API : 
	* create a new request and open a Get request
	* fill header informations for API server (my ID)
	* if I have a response I add all the articles
	* if I have nothing, I will prevent the user I have no articles for him
	*/
	
	const NYTimesId = '10466aca3c664718a30b7c6023fbd2bb';
	const NYTimesUrl = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${NYTimesId}`;
	
	const NYRequest = new XMLHttpRequest();
	NYRequest.open('GET', NYTimesUrl);
	NYRequest.onload = addArticles;
	NYRequest.onerror = function(err) {
		sendError(err, 'articles');
	};
	NYRequest.send();
	
	function addArticles() {
		const articles = JSON.parse(this.responseText);
		
		if(articles.response && articles.response.docs && articles.response.docs.length > 1) {
			articles.response.docs.map(function(article) {
				let listeArticles = `<li>
		<h4><a href="${article.web_url}">${article.headline.main}</a></h4>
		<p>${article.snippet}</p>
		</li>`;
		
		responseContainer.insertAdjacentHTML('beforeend', `<ul>${listeArticles}</ul>`);
			});	
		} else {
			const noArticles = `<h3>Sorry guys...</h3>
	<p>No articles about ${searchedForText}, try again...`;
	responseContainer.insertAdjacentHTML('beforeend', noArticles);
		}
	}    
    });
    
})();



