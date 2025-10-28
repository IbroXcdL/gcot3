// Function to disable various browser functions
function disableBrowserFunctions() {
    // 1. Disable Right Click (Context Menu)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        console.log('Right-click (context menu) is disabled.');
    });

    // 2. Disable Copy/Cut/Paste
    const disableHandler = (e) => {
        e.preventDefault();
        console.log(`Action disabled: ${e.type}`);
    };

    document.addEventListener('copy', disableHandler);
    document.addEventListener('cut', disableHandler);
    document.addEventListener('paste', disableHandler);
}

document.addEventListener('DOMContentLoaded', () => {
    disableBrowserFunctions();

    const donutPageLink = document.getElementById('donut-page-link');
    const searchIcon = document.querySelector('.search-icon');

    // PC Search Elements
    const searchInputWrapper = document.querySelector('.search-input-wrapper');
    const searchInput = document.querySelector('.search-input');
    const searchCloseButton = document.querySelector('.search-close-button');
    const searchInnerIcon = document.querySelector('.search-inner-icon');

    // Mobile Search Elements
    const mobileSearchBar = document.getElementById('mobile-search-bar');
    const mobileSearchContent = document.querySelector('.mobile-search-content');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchInnerIcon = document.getElementById('mobile-search-inner-icon');
    const mobileSearchCloseButton = document.getElementById('mobile-search-close-button');

    // --- Live Search ---
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value === '') {
            document.querySelectorAll('.game-card').forEach(card => card.style.display = 'block');
        } else {
            performSearch(searchInput);
        }
    });

    mobileSearchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value === '') {
            document.querySelectorAll('.game-card').forEach(card => card.style.display = 'block');
        } else {
            performSearch(mobileSearchInput);
        }
    });

    // --- Payment & Region Logic ---
    const regionSelectButton = document.getElementById('region-select-button');
    const regionOptionsList = document.getElementById('region-options');
    const regionOptionButtons = regionOptionsList.querySelectorAll('li button');
    const globalPayments = document.getElementById('global-payments');
    const indianPayments = document.getElementById('indian-payments');
    const paymentButtons = document.querySelectorAll('.payment-button');
    const ORIGINAL_PLACEHOLDER = 'Search GameBin...';
    const ERROR_MESSAGE = 'Please enter a search query!';

    // --- VIEW MANAGEMENT LOGIC ---
    const showPage = (pageId) => {
        closeSearch();
        const views = document.querySelectorAll('.page-view');
        views.forEach(view => {
            view.classList.remove('active');
            if (view.id === pageId) view.classList.add('active');
        });

        const isHomePage = pageId === 'home-page';
        const isDonutPage = pageId === 'donut-page-view';
        const isAllGamesPage = pageId === 'allgame-page-view';

        if (isAllGamesPage) {
    const allGamesFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allGamesFilterBtn) allGamesFilterBtn.click();
}


        donutPageLink.textContent = (isDonutPage || isAllGamesPage) ? 'Back' : 'Buy me a Donut';
        searchIcon.style.display = (isHomePage || isAllGamesPage) ? 'block' : 'none';

        if (isDonutPage || isAllGamesPage) {
            searchInputWrapper.classList.remove('active');
            switchRegion('global', true);
        }

        updateFavouriteIcons();

    };

    // --- REGION & PAYMENT HANDLERS ---
    const toggleDropdown = (open) => {
        const isCurrentlyOpen = regionOptionsList.classList.contains('visible');
        if (open === undefined) open = !isCurrentlyOpen;
        regionOptionsList.classList.toggle('visible', open);
        regionSelectButton.classList.toggle('open', open);
        regionSelectButton.setAttribute('aria-expanded', open);
    };

    const switchRegion = (region, initialLoad = false) => {
        regionOptionButtons.forEach(btn => {
            btn.classList.remove('active-region');
            if (btn.dataset.region === region) {
                btn.classList.add('active-region');
                const regionText = region.charAt(0).toUpperCase() + region.slice(1);
                regionSelectButton.innerHTML = `Select Region: ${regionText} 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-arrow"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
            }
        });

        if (region === 'global') {
            globalPayments.classList.add('active');
            indianPayments.classList.remove('active');
        } else if (region === 'india') {
            indianPayments.classList.add('active');
            globalPayments.classList.remove('active');
        }

        if (!initialLoad) toggleDropdown(false);
    };

    regionSelectButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    regionOptionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const region = e.currentTarget.dataset.region;
            switchRegion(region);
        });
    });

    document.addEventListener('click', (e) => {
        if (!regionSelectButton.contains(e.target) && !regionOptionsList.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    paymentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const link = e.currentTarget.dataset.link;
            window.location.href = link;
        });
    });

    // --- SEARCH LOGIC ---
    const openSearch = () => {
        const isDesktop = window.innerWidth > 768;
        if (isDesktop) {
            searchInputWrapper.classList.add('active');
            searchInput.focus();
        } else {
            mobileSearchBar.classList.add('active');
            mobileSearchInput.focus();
        }
    };

    const closeSearch = () => {
        const isDesktop = window.innerWidth > 768;
        if (isDesktop) {
            searchInputWrapper.classList.remove('active');
            searchInput.value = '';
        } else {
            mobileSearchBar.classList.remove('active');
            mobileSearchInput.value = '';
        }
        if (searchIcon.style.display !== 'none') searchIcon.focus();
        document.querySelectorAll('.game-card').forEach(card => card.style.display = 'block');
    };

    const performSearch = (inputElement) => {
        const isMobile = window.innerWidth <= 768;
        const searchTerm = inputElement.value.trim().toLowerCase();
        const wrapperElement = isMobile ? mobileSearchContent : searchInputWrapper;
        const allGames = document.querySelectorAll('.game-card');

        if (searchTerm === '') {
            wrapperElement.classList.add('error-state');
            inputElement.placeholder = ERROR_MESSAGE;
            setTimeout(() => {
                wrapperElement.classList.remove('error-state');
                inputElement.placeholder = ORIGINAL_PLACEHOLDER;
            }, 800);
            allGames.forEach(card => card.style.display = 'block');
        } else {
            let found = false;
            allGames.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                    found = true;
                } else card.style.display = 'none';
            });
            if (!found) console.log('No matching games found!');
        }
    };

    // --- PAGE NAVIGATION ---
    donutPageLink.addEventListener('click', () => {
        if (donutPageLink.textContent === 'Back') showPage('home-page');
        else showPage('donut-page-view');
    });

    
    document.getElementById('allgamebutton').addEventListener('click', () => {
        showPage('allgame-page-view');
    });


    searchIcon.addEventListener('click', openSearch);
    searchInnerIcon.addEventListener('click', () => performSearch(searchInput));
    searchCloseButton.addEventListener('click', closeSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput);
        }
    });

    mobileSearchInnerIcon.addEventListener('click', () => performSearch(mobileSearchInput));
    mobileSearchCloseButton.addEventListener('click', closeSearch);
    mobileSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(mobileSearchInput);
        }
    });

    document.addEventListener('click', (e) => {
        if (searchIcon.style.display === 'none') return;
        const isDesktop = window.innerWidth > 768;
        const target = e.target;
        if (isDesktop && searchInputWrapper.classList.contains('active')) {
            const insideWrapper = searchInputWrapper.contains(target);
            const onToggle = searchIcon.contains(target);
            if (!insideWrapper && !onToggle) closeSearch();
        } else if (!isDesktop && mobileSearchBar.classList.contains('active')) {
            const insideMobile = mobileSearchBar.contains(target);
            const onToggle = searchIcon.contains(target);
            if (!insideMobile && !onToggle) closeSearch();
        }
    });

    // --- FAVOURITES & RECENTLY PLAYED ---
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];

    document.querySelectorAll('.favourite-btn').forEach(btn => {
        const gameCard = btn.closest('.game-card');
        const gameId = gameCard.dataset.gameId;
        if (favourites.includes(gameId)) {
            btn.innerHTML = '<i class="fa-solid fa-heart" style="color:#ee6912;"></i>';
        }

        btn.addEventListener('click', () => {
            const index = favourites.indexOf(gameId);
            if (index === -1) {
                favourites.push(gameId);
                btn.innerHTML = '<i class="fa-solid fa-heart" style="color:#ee6912;"></i>';
            } else {
                favourites.splice(index, 1);
                btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
            localStorage.setItem('favourites', JSON.stringify(favourites));
            // ← ADD THIS
            updateFavouriteIcons();
            renderFavouritesSection(); // if you have a section showing favourites
        });
    });

// --- Function to update favourites icons dynamically ---
function updateFavouriteIcons() {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    function updateFavouriteIcons() {
    document.querySelectorAll('.favourite-btn').forEach(btn => {
        const gameId = btn.closest('.game-card').dataset.gameId;
        if (favourites.includes(gameId)) {
            btn.innerHTML = '<i class="fa-solid fa-heart" style="color:#ee6912;"></i>';
        } else {
            btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
    });
}


    document.querySelectorAll('.game-card').forEach(card => {
        const btn = card.querySelector('.favourite-btn');
        if (!btn) return;
        const gameId = card.dataset.gameId;
        if (favourites.includes(gameId)) {
            btn.innerHTML = '<i class="fa-solid fa-heart" style="color:#ee6912;"></i>';
        } else {
            btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
    });
}


    // --- FILTER MENU LOGIC ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const allGames = document.querySelectorAll('.game-card');

        // Always hide the favourites message first
        const favMessage = document.getElementById('favourites-message');
        if (favMessage) favMessage.style.display = 'none';

        allGames.forEach(card => card.style.display = 'none');

        if (filter === 'all') {
            allGames.forEach(card => card.style.display = 'block');
        } else if (filter === 'recently') {
            allGames.forEach(card => {
                if (recentlyPlayed.includes(card.dataset.gameId)) card.style.display = 'block';
            });
        } else if (filter === 'favourites') {
            let anyFav = false;

            allGames.forEach(card => {
                if (favourites.includes(card.dataset.gameId)) {
                    card.style.display = 'block';
                    anyFav = true;
                }
            });

            if (!anyFav) {
            favMessage.innerHTML = `No games found in Favourites. Please click <i class="fa fa-heart"></i> on game cards to add games to Favourites.`;
            favMessage.style.display = 'block';       // show as block
            favMessage.style.textAlign = 'center';    // center text horizontally
            favMessage.style.margin = '50px 0';       // space above and below
            favMessage.style.fontSize = '12px';       // font size
            favMessage.style.color = '#33333346';          // text color
            favMessage.style.lineHeight = '1.5';      // optional: makes multi-line text readable
            }
        }else if (filter === 'coming') {
    const csCards = document.querySelectorAll('.game-card.cs');
    if (csCards.length > 0) {
        csCards.forEach(card => card.style.display = 'block');
    } else if (favMessage) {
        favMessage.innerHTML = `No games are coming soon at the moment.`;
        favMessage.style.display = 'block';
        favMessage.style.textAlign = 'center';
        favMessage.style.margin = '50px 0';
        favMessage.style.fontSize = '12px';
        favMessage.style.color = '#33333346';
        favMessage.style.lineHeight = '1.5';
    }
}
    });
});



    // --- PLAY NOW TRACKING ---
    const playNowButtons = document.querySelectorAll('.play-now-btn');
    playNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const gameId = button.closest('.game-card').dataset.gameId;
            if (gameId) {
                addToRecentlyPlayed(gameId);
            }
        });
    });

    function addToRecentlyPlayed(gameId) {
        recentlyPlayed = [gameId, ...recentlyPlayed.filter(id => id !== gameId)].slice(0, 20);
        localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    }

    // --- HOME PAGE RECENTLY PLAYED RENDER ---
    const recentlyPlayedSection = document.getElementById('recently-played-section');
    if (recentlyPlayedSection) {
        const recentlyPlayedCardsContainer = recentlyPlayedSection.querySelector('.recently-played-cards');
        const allGames = document.querySelectorAll('.game-card');
        const gamesMap = {};
        allGames.forEach(card => gamesMap[card.dataset.gameId] = card.cloneNode(true));

       function renderRecentlyPlayed() {
    recentlyPlayedCardsContainer.innerHTML = '';

    // Filter recentlyPlayed to only include games that exist in gamesMap
    const validGames = recentlyPlayed.filter(gameId => gamesMap[gameId]);

    // Hide section if no valid games
    if (validGames.length === 0) {
        recentlyPlayedSection.style.display = 'none';
        return;
    }

    recentlyPlayedSection.style.display = 'block';

    // Show up to 4 recently played games
    const sliceGames = validGames.slice(0, 4);
    sliceGames.forEach(gameId => {
        recentlyPlayedCardsContainer.appendChild(gamesMap[gameId]);
    });

    // Add 'View All' card if more than 4 games in Recently Played on Homepage
    if (validGames.length > 4) {
        const viewAllCard = document.createElement('div');
        viewAllCard.className = 'game-card view-all-card';
        viewAllCard.textContent = 'View All';
          // Add styles via JS
    viewAllCard.style.backgroundColor = 'rgba(146, 146, 146, 0.1)';  // background color
    viewAllCard.style.color = '#000000';            // text color
    viewAllCard.style.fontSize = '11px';
    viewAllCard.style.whiteSpace = 'nowrap';   // keeps text on a single line
    viewAllCard.style.borderRadius = '0'; 
viewAllCard.style.display = 'flex';
viewAllCard.style.justifyContent = 'center';  // centers horizontally
viewAllCard.style.alignItems = 'center';

        viewAllCard.addEventListener('click', () => {
            showPage('allgame-page-view');
            document.querySelector('.filter-btn[data-filter="recently"]').click();
        });
        recentlyPlayedCardsContainer.appendChild(viewAllCard);
    }
}

        renderRecentlyPlayed();
    }
});


// --- AD HANDLING AND AUTO-SCROLL ---
document.addEventListener('DOMContentLoaded', function () {
    const videoAds = document.querySelectorAll('.video-ad-card');
    const imageAds = document.querySelectorAll('.image-ad-card');

    [...videoAds, ...imageAds].forEach(ad => {
        ad.addEventListener('contextmenu', e => e.preventDefault());
        ad.addEventListener('touchstart', function (e) {
            if (e.touches.length > 1) e.preventDefault();
        });
    });

    function autoScroll(containerSelector, intervalTime) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const items = container.children;
        let index = 0;

        setInterval(() => {
            index++;
            if (index >= items.length) index = 0;
            const scrollLeft = items[index].offsetLeft - container.offsetLeft;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }, intervalTime);
    }

    autoScroll('.video-ads-container', 10000);
    // autoScroll('.image-ads-container', 2000);
});

// --- BOTTOM NAV AND SHARE BUTTON --- 
const moreBtn = document.getElementById("moreBtn"); 
const bottomSheet = document.getElementById("bottomSheet"); 
moreBtn.addEventListener("click", () =>{ 
bottomSheet.classList.toggle("active"); 
});

window.addEventListener("click", (e) => {
    if (bottomSheet.classList.contains("active") && !bottomSheet.contains(e.target) && !moreBtn.contains(e.target)) {
        bottomSheet.classList.remove("active");
    }
});

document.getElementById('share-btn').addEventListener('click', function (e) {
    if (!e.isTrusted) return; // ignore synthetic events
    const linkToCopy = "https://www.uperbit.com";

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(linkToCopy)
            .then(showPopup)
            .catch(() => fallbackCopy(linkToCopy));
    } else fallbackCopy(linkToCopy);
});

function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand("copy");
        showPopup();
    } catch (err) {
        console.error("Fallback copy failed:", err);
    }
    document.body.removeChild(textArea);
}

function showPopup() {
    const popup = document.createElement('div');
    popup.textContent = "Link copied, share with your friends.";
    popup.style.position = 'fixed';
    popup.style.bottom = '80px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.background = '#060b30';
    popup.style.color = '#fff';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '30px';
    popup.style.fontFamily = 'sans-serif';
    popup.style.fontSize = '14px';
    popup.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(popup);

    requestAnimationFrame(() => popup.style.opacity = '1');

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 300);
    }, 1000);
}

//dropdownin slider
document.querySelectorAll('.bottom-sheet .dropbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.parentElement;
    const dropdown = parent.querySelector('.dropdown-content');

    // toggle class
    parent.classList.toggle('open');

    if (parent.classList.contains('open')) {
      // Expand smoothly to content height
      dropdown.style.height = dropdown.scrollHeight + "px";
    } else {
      // Collapse smoothly
      dropdown.style.height = "0";
    }
  });
});




//PWA FILE
// PWA FILE
// ===== REGISTER SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  // register using a relative path to ensure correct scope
  navigator.serviceWorker.register('./service-worker.js')
    .then(() => {
      console.log('Service Worker Registered!');
      // wait until the service worker is ready and controlling
      return navigator.serviceWorker.ready;
    })
    .then(() => {
      console.log('Service Worker Ready and Controlling the page');

      // Request version from the SW
      function requestAppVersion() {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' });
        } else {
          // If not controlled yet, wait for controllerchange then request
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' });
            }
          });
        }
      }

      // Listen for the version response
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'VERSION') {
          const versionElement = document.getElementById('app-version');
          if (versionElement) versionElement.textContent = `v${event.data.version}`;
          console.log('App Version:', event.data.version);
        }
      });

      // ask now that the SW is ready
      requestAppVersion();
    })
    .catch(err => console.error('Service Worker Failed:', err));
}

// ===== AUTO-RELOAD WHEN NEW VERSION ACTIVATES =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('New version activated, reloading...');
    window.location.reload();
  });
}




// ===================== APP UPDATE SYSTEM =====================
document.addEventListener('DOMContentLoaded', () => {
  const CURRENT_VERSION = '1.9.3'; // Change this when releasing a new version
  const updateBtn = document.getElementById('checkUpdateBtn');
  const progressContainer = document.getElementById('updateProgress');
  const progressBar = document.getElementById('progressBar');

  if (!updateBtn) return;

  updateBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('./manifest.json?cacheBust=' + Date.now());
      const manifest = await response.json();

      if (manifest.version !== CURRENT_VERSION) {
        // ✅ Show progress animation (update available)
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Animate progress bar smoothly
        setTimeout(() => {
          progressBar.style.transition = 'width 3s linear';
          progressBar.style.width = '100%';
        }, 100);

        // Reload app after progress completes
        setTimeout(() => {
          progressContainer.style.display = 'none';
          location.reload(true);
        }, 4000);
      } else {
        // 🚫 No update available
        progressContainer.style.display = 'none';

        // Create a floating message
        const message = document.createElement('div');
        message.textContent = '✅ No updates available';
        message.style.position = 'fixed';
        message.style.bottom = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.background = '#f0f0f0';
        message.style.color = '#000';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '8px';
        message.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        message.style.fontSize = '14px';
        message.style.zIndex = '9999';
        document.body.appendChild(message);

        // Remove after 2 seconds
        setTimeout(() => {
          message.remove();
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      alert('⚠️ Failed to check for updates.');
    }
  });
});


