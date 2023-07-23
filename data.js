// Google Sheets API Key (Replace with your actual API key)
const GOOGLE_SHEETS_API_KEY = 'AIzaSyBDGL5m129y7EI8_urEc0mLSoxl53s_v2A';

// GitHub Repository Details (Replace with your actual repository details)
const GITHUB_REPO_OWNER = 'Siddhartha-blogs';
const GITHUB_REPO_NAME = 'siddhartha-blogs.github.io';
const GITHUB_ACCESS_TOKEN = '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';

// Google Sheets Spreadsheet ID (Replace with your actual spreadsheet ID)
const SPREADSHEET_ID = '1uen4iWMdljO1YxzwAmLsi7bdfBE9Ah_qwrBbdRtptIk';

// Function to fetch comments from GitHub repository
async function fetchComments() {
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Function to display comments in the comments container
function displayComments(comments) {
  const commentsContainer = document.getElementById('comments-container');
  commentsContainer.innerHTML = '';

  comments.forEach(comment => {
    const commentHTML = `
      <div>
        <strong>${comment.user.login}</strong> (${comment.user.email}) - ${comment.created_at}<br>
        ${comment.body}
      </div>
      <hr>
    `;
    commentsContainer.innerHTML += commentHTML;
  });
}

// Function to add a new comment to Google Sheets
async function addComment(name, email, comment) {
  const url = `https://sheets.googleapis.com/spreadsheets/d/${SPREADSHEET_ID}/values/Sheet1:append?valueInputOption=RAW`;
  const timestamp = new Date().toLocaleString();
  const values = [[name, email, comment, timestamp]];
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOOGLE_SHEETS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values
    })
  });

  return response.json();
}

// Event listener for form submission
document.getElementById('comment-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const comment = document.getElementById('comment').value;

  // Add the comment to Google Sheets
  await addComment(name, email, comment);
  
  // Fetch comments again to update the comments container
  const comments = await fetchComments();
  displayComments(comments);
});

// Initial fetch and display of comments
fetchComments().then(displayComments);
