# Thoracic Evidence Atlas

A learning website for thoracic oncology trials: NSCLC, SCLC, thymic tumours and mesothelioma.
Built with only **HTML, CSS and JavaScript**: no installation, no server, no database.

## How to open it

1. On GitHub, press the green **Code** button → **Download ZIP**, then unzip it.
2. Double-click **`index.html`**. It opens in your web browser. That's it.

Or open **`thoracic-evidence-atlas.html`**, which holds the whole site in one file
(easy to email to yourself or keep on a phone).

## What's inside

| File | What it does | Edit it to… |
|---|---|---|
| `index.html` | The page skeleton and top menu | rename menu items |
| `css/styles.css` | Colours, fonts, spacing | change a colour (the `:root` section at the top) |
| `js/app.js` | Draws every page from the data | change wording on pages |
| `js/data.js` | All trials, biomarkers, drugs | **don't edit by hand** |
| `thoracic-evidence-atlas.html` | The whole site in a single file | (a copy; edit the files above instead) |

### Changing a colour (a good first edit)
Open `css/styles.css` in any text editor (even Notepad or TextEdit). Near the top you'll see lines like:

```css
--nsclc: #dcecff;   --nsclc-ink: #0b4f9c;
```

`#dcecff` is the pastel blue behind NSCLC. Replace it with another colour code (search "colour picker" in
Google to find codes), save, and refresh the browser.

## Where the numbers come from

Every result (hazard ratio, confidence interval, median, P value, response rate) was copied from the
trial's **PubMed abstract**. The site shows the **exact quote** next to each number ("Show exact quote")
and a PubMed link. All values are marked **"Awaiting verification"** until a clinician checks them against
the full paper. Doses are not shown; always check the current drug label.

For learning only. Not medical advice.
