from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to dashboard...")
        # Navigate to dashboard
        try:
            page.goto("http://localhost:3000/dashboard")
        except Exception as e:
            print(f"Error navigating: {e}")
            browser.close()
            return

        print("Setting view mode to dock...")
        # Set view mode to dock to enable FloatingNavbar
        page.evaluate("localStorage.setItem('layout-view-mode', 'dock')")

        print("Reloading page...")
        page.reload()

        # Wait for the FloatingNavbar to be attached
        # The navbar has a specific class or structure.
        # In the code: <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        # And inside is FloatingDock.

        # We can look for the "Tableau de Bord" text which might be in the DOM even if hidden (framer motion might hide opacity but keep in DOM)
        # Or look for the div with fixed bottom-8

        print("Waiting for FloatingNavbar...")
        # We look for a fixed element at the bottom.
        navbar_locator = page.locator(".fixed.bottom-8")
        expect(navbar_locator).to_be_visible(timeout=10000)

        print("Taking screenshot...")
        page.screenshot(path="/home/jules/verification/navbar_verification.png")

        print("Verification complete.")
        browser.close()

if __name__ == "__main__":
    run()
