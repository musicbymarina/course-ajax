/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        
        /** @description Use JSON data from the server and use it to to add Pixabay image
        * 	If Pixabay has no image to use, invite the user to try another words
        *	@param data - Data from Pixabay API
        */
        
		function addImage(data) {
			const firstImage = data.hits[0];
			if(data && data.hits && firstImage) {
				const htmlContent = `<figure>
					<img src='${firstImage.webformatURL}' alt='${firstImage.tags}'>
					<figcaption>${searchedForText}</figcaption>
					</figure>`;
					console.log(`${firstImage.tags}`);
					console.log(`${searchedForText}`);
			
				responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
			}
			else {
				const noImages = `<h3>Sorry guys...</h3>
				<p>No images about ${searchedForText}, try again...`;
				responseContainer.insertAdjacentHTML('beforeend', noImages);
			}
		};
		
		
		/** @description Add ajax to see Pixabay image
        *	
        */
        const pixabayUrl = `https://pixabay.com/api/?key=8326628-dc9ac48259cd959e1aeaf66d8&q=${searchedForText}&image_type=photo&pretty=true`;

        $.ajax({
        	url: pixabayUrl
        }).done(addImage)
        .fail(function(err) {
        	requestError(err, 'images');
        });
        
        
        /** @description Use JSON data from the server and use it to to add NY Times articles
        * 	If the magazine has no article to use, invite the user to try another words
        *	@param data - Data from NY Times API
        */
		function addArticles(data) {
			const nyArticles = data.response;
			
			if(nyArticles && nyArticles.docs && nyArticles.docs.length > 1) {
				nyArticles.docs.map(function(article) {
					const htmlContent = `
					<li>
					<h3><a href='${article.web_url}'>${article.headline.main}</a></h3>
					<p>${article.snippet}</p>
					</li>`;
					console.log(article.web_url);
					console.log(article.headline.main);
					console.log(article.snippet);
					
					responseContainer.insertAdjacentHTML('beforeend', `<url>${htmlContent}</url>`);
				});
				
			} else {
				const noArticles = `<h3>Sorry guys...</h3>
				<p>No articles about ${searchedForText}, try again...`;
				responseContainer.insertAdjacentHTML('beforeend', noArticles);
			}
		}
			
		/** @description Add ajax to see Pixabay image
        *	
        */
		const nyId = '10466aca3c664718a30b7c6023fbd2bb';
		const nyUrl = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nyId}`;
		
        $.ajax({url: nyUrl})
        .done(addArticles)
        .fail(function(err) {
        	requestError(err, 'articles');
        })
        
        /** @description Display the error message if the user has no answer from his request
        *	@param err - Error message
        *	@param part - Part of the text content I need to change (images OR articles)
        */
        function requestError(err, part) {
        	const text = `<h3>Sorry guys...</h3>
			<p>No ${part} about ${searchedForText}, try again...</p>`;
			console.log(err);
			responseContainer.insertAdjacentHTML("afterbegin", text);
        } 
    });
})();
