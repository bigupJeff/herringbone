/**
 * Content index Module.
 *
 * Auto-generate a sticky index drawer.
 *
 * @package herringbone
 * @author Jefferson Real <me@jeffersonreal.uk>
 * @copyright Copyright (c) 2024, Jefferson Real
 */

const contentIndex = () => {

	const content = document.querySelector( 'body > main' ),
	index         = document.querySelector( '.contentIndex' ),
	drawer        = document.querySelector( '.contentIndex_drawer' ),
	tab           = document.querySelector( '.contentIndex_tab' ),
	nav           = document.querySelector( '.contentIndex_nav' ),
	titleSelector = 'h2'

	let hasTouchedDoc   = false,
	hasTouchedLink  = false,
	hasTouchedOpen  = false,
	hasTouchedClose = false,
	hasSwipedLeft   = false,
	hasSwipedY      = false,
	isTouchingIndex = false,
	touchStartX     = 0,
	touchStartY     = 0

	if ( content === null ||
	index   === null ||
	drawer  === null ||
	tab     === null ||
	nav     === null ) {
	throw new Error( 'contentIndex: Required element missing' );
	} else {
	index.style.display = 'flex'
	}

	const slugify = ( string ) =>
	string
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");

	const buildIndex = () => {
	content.querySelectorAll( 'section' ).forEach( ( section ) => {
		const title = section.querySelector( titleSelector ).textContent,
				slug  = slugify( title ),
				a     = document.createElement( 'a' )
		let   id    = ''
		if ( section.id.length > 0 ) {
			id = section.id
		} else {
			id = slug
			section.id = id
		}
		a.href      = '#' + id
		a.innerHTML = title
		nav.insertAdjacentElement( 'beforeend', a )
	} )
	}

	let endActiveTimeout
	const debouncedEndActive = ( wait = 800 ) => {
	if ( hasSwipedLeft || hasTouchedLink || hasTouchedClose ) {
		// Close immediately after user-initiated touch actions.
		hasSwipedLeft   = false
		hasTouchedLink  = false
		hasTouchedClose = false
		wait = 0
	} else if ( hasTouchedOpen ) {
		// Delay auto-close on touch devices (mouse users can hover to keep index open).
		hasTouchedOpen = false
		wait = 6000
	}
	clearTimeout( endActiveTimeout )
	endActiveTimeout = setTimeout( () => {
		const isHovered = nav?.matches( ':hover' )
		if ( ! isHovered || hasTouchedDoc ) {
			// Not hovered by mouse (touch hover ignored).
			drawer.classList.remove( 'active' )
		}
	}, wait )
	}

	let endScrollingTimeout
	const debouncedEndScrolling = ( wait = 800 ) => {
	clearTimeout( endScrollingTimeout )
	endScrollingTimeout = setTimeout( () => {
		drawer.classList.remove( 'scrolling' )
	}, wait )
	}

	let setActiveLinkTimeout
	const debouncedSetActiveLink = () => {
	clearTimeout( setActiveLinkTimeout )
	setActiveLinkTimeout = setTimeout( () => {
		for ( const child of content.children ) {
			const h2 = child.querySelector( 'h2' ).getBoundingClientRect()
			// Find first title from top visible in viewport.
			if ( h2.top > 0 ) {
				nav.querySelector( 'a.active' )?.classList.remove( 'active' )
				nav.querySelector( `a[href="#${child.id}"]` )?.classList.add( 'active' )
				break
			}
		}
	}, 10 )
	}

	const mouseOverAction = () => ! hasTouchedDoc && drawer.classList.add( 'active' )

	const mouseLeaveAction = () => ! hasTouchedDoc && debouncedEndActive()

	const scrollAction = () => {
	drawer.classList.add( 'scrolling' )
	debouncedEndScrolling()
	debouncedSetActiveLink()
	}

	const documentTouchStartAction = () => {
	drawer.classList.add( 'isTouch' )
	hasTouchedDoc = true
	}

	const indexTouchStartAction = ( e ) => {
	isTouchingIndex = true
	touchStartX = e.targetTouches[0].screenX
	touchStartY = e.targetTouches[0].screenY
	}

	const touchMoveAction = ( e ) => {
	if ( ! isTouchingIndex ) return;
	const swipeDistanceY = Math.abs( touchStartY - e.targetTouches[0].screenY )
	const swipeDistanceX = touchStartX - e.targetTouches[0].screenX
	if ( swipeDistanceY > 32 ) {
		hasSwipedY = true
		return
	}
	if ( swipeDistanceX > 32 ) {
		hasSwipedLeft = true
		debouncedEndActive()
	}
	}

	const touchEndAction = ( e ) => {
	isTouchingIndex = false
	const touchedLink  = e.target.nodeName === 'A' && drawer.classList.contains( 'active' ),
			touchedOpen  = e.target.closest( '.contentIndex_tab' ) && ! drawer.classList.contains( 'active' ),
			touchedClose = e.target.closest( '.contentIndex_tab' ) && drawer.classList.contains( 'active' )
	if ( hasSwipedY ) {
		// Don't call debouncedEndActive as user may be scrolling the menu.
		hasSwipedY = false
		return
	} else if ( touchedLink ) {
		hasTouchedLink = true
		debouncedEndActive()
	} else if ( touchedOpen ) {
		hasTouchedOpen = true
		drawer.classList.add( 'active' )
		debouncedEndActive()
	} else if ( touchedClose ) {
		hasTouchedClose = true
		debouncedEndActive()
	}
	}

	const addListeners = () => {
	[ nav, tab ].forEach( ( element ) => element?.addEventListener( 'mouseover', () => mouseOverAction() ) );
	[ nav, tab ].forEach( ( element ) => element?.addEventListener( 'mouseleave', () => mouseLeaveAction() ) );
	document.addEventListener( 'scroll', () => scrollAction() );
	// Touch event listeners for mobile devices
	document.addEventListener( 'touchstart', ( e ) => documentTouchStartAction( e ), { once: true } )
	index.addEventListener( 'touchstart', ( e ) => indexTouchStartAction( e ) )
	index.addEventListener( 'touchmove', ( e ) => touchMoveAction( e ) )
	index.addEventListener( 'touchend', ( e ) => touchEndAction( e ) )
	}

	const docLoaded = setInterval( () => {
		if ( document.readyState === 'complete' ) {
			clearInterval( docLoaded )
			buildIndex()
			addListeners()
		}
	}, 100 )
}

export { contentIndex }