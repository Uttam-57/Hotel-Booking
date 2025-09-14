// Find the elements we need.
const searchInput = document.getElementById('searchInput');
const searchForm = searchInput.closest('form');
const suggestionsBox = document.getElementById('suggestionsBox');

// This script will only run if all essential elements exist on the page.
if (searchForm && searchInput && suggestionsBox) {

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    const fetchSuggestions = async (event) => {
        const query = event.target.value;
        if (query.length < 2) {
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`/listings/suggestions?q=${query}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const suggestions = await response.json();
            suggestionsBox.innerHTML = '';
            if (suggestions.length > 0) {
                suggestions.forEach(suggestion => {
                    const div = document.createElement('div');
                    div.textContent = suggestion.title;
                    div.classList.add('suggestion-item');
                    div.onclick = () => {
                        searchInput.value = suggestion.title;
                        suggestionsBox.innerHTML = '';
                        suggestionsBox.style.display = 'none';
                        // This submits the form for a full page reload with the result
                        searchForm.requestSubmit(); 
                    };
                    suggestionsBox.appendChild(div);
                });
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        } catch (error) {
            console.error("Could not fetch suggestions:", error);
        }
    };

    // This listener provides the autocomplete suggestions as you type
    searchInput.addEventListener('input', debounce(fetchSuggestions, 300));

    // This listener hides the suggestions box if you click elsewhere on the page
    document.addEventListener('click', (event) => {
        if (!searchForm.contains(event.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}