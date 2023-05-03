class PredictiveSearch extends HTMLElement {
    constructor() {
        super();
        this.cachedResults = {};
        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearchResults = this.querySelector('.js-predictive-search');
        this.searchWindow = document.querySelector('.js-search-window');
        this.searchOpenBtns = document.querySelectorAll('.js-open-search');
        this.searchCloseBtns = document.querySelectorAll('.js-close-search');
        this.inputMobileWrapper = document.querySelector('.js-input-mobile-wrapper');
        this.loader = document.querySelector('.js-search-loader[data-loader]');
        this.closeSearchInput = document.querySelector('.js-close-search-btn');
        this.isOpen = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = this.querySelector('.js-search');
        form.addEventListener('submit', this.onFormSubmit.bind(this));

        this.input.addEventListener('input', debounce((event) => {
            this.onChange(event);
        }, 100).bind(this));

        this.input.addEventListener('focus', this.onFocus.bind(this));
        this.addEventListener('focusout', this.onFocusOut.bind(this));
        this.addEventListener('keyup', this.onKeyup.bind(this));
        this.addEventListener('keydown', this.onKeydown.bind(this));

        this.input.addEventListener('focus', event => {
            this.openSearch();
        });

        this.searchCloseBtns.forEach((btn, i) => {
            btn.addEventListener('click', event => {
                this.close(true);
                this.searchWindow.style.display = "none";
                document.body.style.overflow = "auto";

                if (this.searchWindow.classList.contains('js-search-1') && window.matchMedia('(max-width: 768px)').matches) {
                    this.inputMobileWrapper.style.display = "none";
                } else if (this.searchWindow.classList.contains('js-search-2') && window.matchMedia('(max-width: 991px)').matches) {
                    this.inputMobileWrapper.style.display = "none";
                }
            });
        });

        this.searchOpenBtns.forEach((btn, i) => {
            btn.addEventListener('click', event => {
                this.open();

                if (btn.classList.contains('js-icon-search')) {
                    setTimeout(() => {
                        this.input.focus();
                    }, 200)
                }
                if (this.searchWindow.classList.contains('js-search-1') && window.matchMedia('(max-width: 768px)').matches) {
                    this.inputMobileWrapper.style.display = "block";
                    this.input.focus();
                } else if (this.searchWindow.classList.contains('js-search-2') && window.matchMedia('(max-width: 991px)').matches) {
                    this.inputMobileWrapper.style.display = "block";
                    this.input.focus();
                }
            });
        });
    }

    openSearch() {
        this.isOpen = true;
    }

    getQuery() {
        return this.input.value.trim();
    }

    onChange() {
        const searchTerm = this.getQuery();

        if (!searchTerm.length) {
            this.searchWindow.style.display = "none";
            document.body.style.overflow = "auto";
            this.predictiveSearchResults.classList.add("hidden");
            return;
        } else {
            this.searchWindow.style.display = "block";
            document.body.style.overflow = "hidden";
            this.predictiveSearchResults.classList.remove("hidden");
        }

        this.getSearchResults(searchTerm);
    }

    onFormSubmit(event) {
        if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
    }

    onFocus() {
        const searchTerm = this.getQuery();

        this.closeSearchInput.classList.remove('hidden');

        if (!searchTerm.length) return;

        if (this.getAttribute('results') === 'true') {
            this.open();
        } else {
            this.getSearchResults(searchTerm);
        }
    }

    onFocusOut() {
        setTimeout(() => {
            if (!this.contains(document.activeElement)) {
                if (this.searchWindow.classList.contains('js-search-1') && window.matchMedia('(min-width: 768px)').matches) {
                    this.searchWindow.style.display = "none";
                    document.body.style.overflow = "auto";
                } else if (this.searchWindow.classList.contains('js-search-2') && window.matchMedia('(min-width: 991px)').matches) {
                    this.searchWindow.style.display = "none";
                    document.body.style.overflow = "auto";
                }
                this.close();
            }
        })
    }

    onKeyup(event) {
        if (!this.getQuery().length) this.close(true);
        event.preventDefault();

        switch (event.code) {
            case 'ArrowUp':
                this.switchOption('up')
                break;
            case 'ArrowDown':
                this.switchOption('down');
                break;
            case 'Enter':
                this.selectOption();
                break;
        }
    }

    onKeydown(event) {
        // Prevent the cursor from moving in the input when using the up and down arrow keys
        if (
            event.code === 'ArrowUp' ||
            event.code === 'ArrowDown'
        ) {
            event.preventDefault();
        }
    }

    switchOption(direction) {
        if (!this.getAttribute('open')) return;

        const moveUp = direction === 'up';
        const selectedElement = this.querySelector('[aria-selected="true"]');
        const allElements = this.querySelectorAll('li');
        let activeElement = this.querySelector('li');

        if (moveUp && !selectedElement) return;

        this.statusElement.textContent = '';

        if (!moveUp && selectedElement) {
            activeElement = selectedElement.nextElementSibling || allElements[0];
        } else if (moveUp) {
            activeElement = selectedElement.previousElementSibling || allElements[allElements.length - 1];
        }

        if (activeElement === selectedElement) return;

        activeElement.setAttribute('aria-selected', true);
        if (selectedElement) selectedElement.setAttribute('aria-selected', false);

        this.setLiveRegionText(activeElement.textContent);
        this.input.setAttribute('aria-activedescendant', activeElement.id);
    }

    selectOption() {
        const selectedProduct = this.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');

        if (selectedProduct) selectedProduct.click();
    }

    getSearchResults(searchTerm) {
        const queryKey = searchTerm.replace(" ", "-").toLowerCase();
        this.setLiveRegionLoadingState();

        if (this.cachedResults[queryKey]) {
            this.renderSearchResults(this.cachedResults[queryKey]);
            return;
        }

        window.Global.showLoader(this.loader);

        fetch(`/search/suggest?q=${searchTerm}&resources[type]=product,article,page,collection&resources[limit]=10&section_id=predictive-search`)
            .then((response) => {
                if (!response.ok) {
                    var error = new Error(response.status);
                    this.close();
                    throw error;
                }

                return response.text();
            })
            .then((text) => {
                const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
                this.cachedResults[queryKey] = resultsMarkup;
                this.renderSearchResults(resultsMarkup);
            })
            .catch((error) => {
                this.close();
                throw error;
            })
            .finally(() => {
                window.Global.hideLoader(this.loader);
            });
    }

    setLiveRegionLoadingState() {
        this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
        this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

        this.setLiveRegionText(this.loadingText);
        this.setAttribute('loading', true);
    }

    setLiveRegionText(statusText) {
        this.statusElement.setAttribute('aria-hidden', 'false');
        this.statusElement.textContent = statusText;

        setTimeout(() => {
            this.statusElement.setAttribute('aria-hidden', 'true');
        }, 1000);
    }

    renderSearchResults(resultsMarkup) {
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.setAttribute('results', true);

        this.setLiveRegionResults();
        this.open();
    }

    setLiveRegionResults() {
        this.removeAttribute('loading');
        this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
    }

    open() {
        const inputWrapper = document.querySelector('.js-search-input');
        const headerHide = document.querySelectorAll('.js-header-hide');
        if (inputWrapper && headerHide) {
            headerHide.forEach((el) => {
                el.classList.add('lg:opacity-0', 'lg:invisible');
            })
            inputWrapper.classList.remove('lg:w-0', 'lg:opacity-0', 'lg:invisible');
            inputWrapper.classList.add('lg:w-1/2');
        }

        this.setAttribute('open', true);
        this.input.setAttribute('aria-expanded', true);
        this.closeSearchInput.classList.remove('hidden');
        this.isOpen = true;
    }

    close(clearSearchTerm = false) {
        const inputWrapper = document.querySelector('.js-search-input');
        const headerHide = document.querySelectorAll('.js-header-hide');
        if (inputWrapper && headerHide) {
            inputWrapper.classList.remove('lg:w-1/2');
            inputWrapper.classList.add('lg:w-0', 'lg:opacity-0', 'lg:invisible');
            setTimeout(() => {
                headerHide.forEach((el) => {
                    el.classList.remove('lg:opacity-0', 'lg:invisible');
                })
            }, 300)
        }

        const searchTerm = this.getQuery();

        if (clearSearchTerm) {
            this.input.value = '';
            this.removeAttribute('results');
        }

        const selected = this.querySelector('[aria-selected="true"]');

        if (selected) selected.setAttribute('aria-selected', false);

        this.input.setAttribute('aria-activedescendant', '');
        this.removeAttribute('open');
        this.input.setAttribute('aria-expanded', false);
        this.predictiveSearchResults.removeAttribute('style');
        this.closeSearchInput.classList.add('hidden');

        if (!searchTerm.length) {
            this.predictiveSearchResults.classList.add("hidden");
            return;
        } else {
            this.predictiveSearchResults.classList.remove("hidden");
        }

        this.isOpen = false;
    }
}

customElements.define('predictive-search', PredictiveSearch);
