(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        
       
       	/** @description - Insert an image in the response Container 
       	*	If there's no image, insert a message for the user
       	* @param data - Javascript object converted, from the server
       	*/
    	function addImage(data) {
     	let htmlContent;
     	const firstImage = data.hits[0];
     	
     		if(firstImage) {
     			htmlContent = `<picture>
     			<img src="${firstImage.largeImageURL}" alt="${firstImage.tags}">
     			<figcaption>${firstImage.tags}</figcaption>
     			</picture>`;
     			responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
     		} 
     		else {
     		htmlContent = `<h3>Sorry guys...</h3>
     		<p>We didn't find your ${part} about ${searchedForText}</p>`;
     		responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
     		}
     	}   
     
        /** @description - Insert some articles in the response Container, after the image
       	*	If there's no articles, insert a message for the user
       	* 	@param data - Javascript object converted, from the server
       	*/
     	function addArticles(data) {
     	let htmlContent;
     	const articles = data.response.docs;
     	
     		if(articles.length > 1) {
     			articles.map(article => {
     				htmlContent = `<li>
     				<h3> <a href="${article.web_url}">${article.headline.main} </a> </h3>
     				<p> ${article.snippet} </p>
     				</li>`;
     				responseContainer.insertAdjacentHTML("beforeend", `<ul>${htmlContent}</ul>`);
     			});
     		}
     		else {
     			htmlContent = `<h3>Sorry guys...</h3>
     			<p>We didn't find your ${part} about ${searchedForText}</p>`;
     			responseContainer.insertAdjacentHTML("beforeend", htmlContent);
     		}
     	}
        
        /** @description - Log your error if there's no content and display the error on the page
       	*	@param err - Description of the error
       	* 	@param part - Part of the content (image / articles)
       	*/
        function sendError(err, part) {
        	console.log(err);
        	let htmlContent = `<h3>Sorry guys...</h3>
     		<p>We didn't find your ${part} about ${searchedForText}</p>`;
        }
        
        
        /** @description - Search the request through the network to Pixabay API, 
        *	Return the converted json response, display it
       	*	If there's no image, insert a message for the user
       	*/
       	// Pixabay URL for fetch
        const pixabayUrl = `https://pixabay.com/api/?key=8326628-dc9ac48259cd959e1aeaf66d8&q=${searchedForText}&image_type=photo&pretty=true`;

        fetch(pixabayUrl)
        .then(response => response.json())
        .then(addImage)
        .catch(err => sendError(err, 'images')
        );
        
        /** @description - Search the request through the network to NY Times API, 
        *	Return the converted json response, display it
       	*	If there's no articles, insert a message for the user
       	*/
       	// NY Times ID and URL for fetch
        const nyId = '10466aca3c664718a30b7c6023fbd2bb';
		const nyUrl = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nyId}`;
		
		fetch(nyUrl)
		.then(response => response.json())
		.then(addArticles)
		.catch(err => sendError(err, 'articles')
		);

    });
})();
