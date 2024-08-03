document.addEventListener('DOMContentLoaded', () => {
	const lazyBackgrounds = document.querySelectorAll('#slider[data-bg]');
	if ('IntersectionObserver' in window) {
		const lazyBackgroundObserver = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const lazyBackground = entry.target;
					lazyBackground.style.backgroundImage = `url(${lazyBackground.dataset.bg})`;
					lazyBackgroundObserver.unobserve(lazyBackground);
				}
			});
		});

		lazyBackgrounds.forEach(lazyBackground => {
			lazyBackgroundObserver.observe(lazyBackground);
		});
	} else {
		lazyBackgrounds.forEach(lazyBackground => {
			lazyBackground.style.backgroundImage = `url(${lazyBackground.dataset.bg})`;
		});
	}
 })

// Function to generate a random passphrase
function generatePassphrase(wordCount = 5, capitalize = false, includeNumber = false, separator = ' ') {
	const words = [
		"apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon",
		"mango", "nectarine", "orange", "pear", "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla",
		"watermelon", "xigua", "yellowfruit", "zucchini"
	];

	let passphrase = [];
	for (let i = 0; i < wordCount; i++) {
		const randomIndex = Math.floor(Math.random() * words.length);
		let word = words[randomIndex];
		if (capitalize) {
			word = word.charAt(0).toUpperCase() + word.slice(1);
		}
		passphrase.push(word);
	}

	if (includeNumber) {
		const randomNumber = Math.floor(Math.random() * 100);
		passphrase.push(randomNumber);
	}

	return passphrase.join(separator);
}

// Function to generate a random password
function generatePassword() {
	const length = parseInt(document.getElementById('passwordLength').value);
	const charset = {
		uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		lowercase: "abcdefghijklmnopqrstuvwxyz",
		numbers: "0123456789",
		symbols: "!@#$%^&*"
	};

	let characters = "";
	if (document.getElementById('uppercase').checked) characters += charset.uppercase;
	if (document.getElementById('numbers').checked) characters += charset.numbers;
	if (document.getElementById('lowercase').checked) characters += charset.lowercase;
	if (document.getElementById('symbols').checked) characters += charset.symbols;

	let password = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		password += characters[randomIndex];
	}

	document.getElementById('generatedPassword').value = password;
	const entropy = calculateEntropy(password);
	document.getElementById('passwordStrength').textContent = `Entropy: ${entropy.toFixed(2)} bits`;
	document.getElementById('crackTime').textContent = `Estimated crack time: ${estimateCrackTime(entropy)}`;
	updateStrengthIndicator(entropy, 'passwordStrength');

}

// Function to update password length value
function updatePasswordLength() {
	document.getElementById('passwordLengthValue').textContent = document.getElementById('passwordLength').value;
	generatePassword();
}

// Function to update passphrase word count value
function updatePassphraseWordCount() {
	const wordCount = document.getElementById('passphraseWordCount').value;
	document.getElementById('passphraseWordCountValue').textContent = wordCount;
	const capitalize = document.getElementById('capitalize').checked;
	const includeNumber = document.getElementById('includeNumber').checked;
	const separator = document.getElementById('wordSeparator').value;

	const passphrase = generatePassphrase(wordCount, capitalize, includeNumber, separator);
	document.getElementById('generatedPassphrase').value = passphrase;
	const entropy = calculateEntropy(passphrase);
	document.getElementById('passphraseStrength').textContent = `Entropy: ${entropy.toFixed(2)} bits`;
	document.getElementById('passphraseCrackTime').textContent = `Estimated crack time: ${estimateCrackTime(entropy)}`;
	updateStrengthIndicator(entropy, 'passphraseStrength');
}

// Event listener for the Generate Passphrase button
document.getElementById('generatePassphraseButton').addEventListener('click', updatePassphraseWordCount);

// Event listener for the Copy Passphrase button
document.getElementById('copyPassphraseButton').addEventListener('click', () => {
	const passphraseInput = document.getElementById('generatedPassphrase');
	passphraseInput.select();
	document.execCommand('copy');
	alert('Passphrase copied to clipboard!');
});

// Event listener for the Regenerate Password button
document.getElementById('regenerateButton').addEventListener('click', generatePassword);

// Event listener for the Copy Password button
document.getElementById('copyButton').addEventListener('click', () => {
	const passwordInput = document.getElementById('generatedPassword');
	passwordInput.select();
	document.execCommand('copy');
	alert('Password copied to clipboard!');
});


// Initial call to set the default values
generatePassword();
updatePassphraseWordCount();

// Update password length value on slider change
document.getElementById('passwordLength').addEventListener('input', updatePasswordLength);

// Update passphrase word count value on slider change
document.getElementById('passphraseWordCount').addEventListener('input', updatePassphraseWordCount);

function calculateEntropy(string) {
	const charset = {
		uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		lowercase: "abcdefghijklmnopqrstuvwxyz",
		numbers: "0123456789",
		symbols: "!@#$%^&*"
	};

	const length = string.length;
	const charSetSize = {
		uppercase: document.getElementById('uppercase').checked ? charset.uppercase.length : 0,
		lowercase: document.getElementById('lowercase').checked ? charset.lowercase.length : 0,
		numbers: document.getElementById('numbers').checked ? charset.numbers.length : 0,
		symbols: document.getElementById('symbols').checked ? charset.symbols.length : 0
	};

	const totalCharSetSize = Object.values(charSetSize).reduce((a, b) => a + b, 0);
	return length * Math.log2(totalCharSetSize);
}

function estimateCrackTime(entropy) {
	const guessesPerSecond = 1e9; // Example guesses per second (1 billion guesses/sec)
	const seconds = Math.pow(2, entropy) / guessesPerSecond;
	const units = ["seconds", "minutes", "hours", "days", "years"];
	let unit = units[0];
	let value = seconds;

	if (value >= 60) {
		value /= 60;
		unit = units[1];
	}
	if (value >= 60) {
		value /= 60;
		unit = units[2];
	}
	if (value >= 24) {
		value /= 24;
		unit = units[3];
	}
	if (value >= 365) {
		value /= 365;
		unit = units[4];
	}

	return `${Math.round(value)} ${unit}`;
}

function updateStrengthIndicator(entropy, elementId) {
	const element = document.getElementById(elementId);
	if (entropy < 28) {
		element.className = 'very-weak';
	} else if (entropy < 40) {
		element.className = 'weak';
	} else if (entropy < 60) {
		element.className = 'medium';
	} else {
		element.className = 'strong';
	}
}