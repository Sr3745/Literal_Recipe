const visualizeBtn = document.getElementById('visualize-btn');
const recipeStepInput = document.getElementById('recipe-step');
const imageContainer = document.getElementById('image-container');
const placeholderText = document.getElementById('placeholder-text');

async function generateImage() {
    const userPrompt = recipeStepInput.value;
    if (!userPrompt) {
        alert("Please enter a recipe step!");
        return;
    }

    placeholderText.textContent = 'Interpreting your instructions... literally...';
    visualizeBtn.disabled = true;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userPrompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Something went wrong');
        }

        const data = await response.json();
        imageContainer.innerHTML = `<p style="padding: 20px;">${data.text}</p>`;

    } catch (error) {
        console.error("Error:", error);
        placeholderText.textContent = `Oops! ${error.message}. Try again.`;
    } finally {
        visualizeBtn.disabled = false;
    }
}

visualizeBtn.addEventListener('click', generateImage);