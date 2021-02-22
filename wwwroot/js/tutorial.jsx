class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }
    loadCommentsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true); //call http get on /comments endpoint (this /comments get set on Render function)
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText); //parse comments JSON response into a data object
            this.setState({ data: data }); //set state with comments from variable above called data
        };
        xhr.send();
    }
    handleCommentSubmit(comment) {
        const data = new FormData(); //Initialize comment data object
        data.append('Author', comment.author); //set comment author
        data.append('Text', comment.text); //set comment text

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true); //call comment/new endpoint with a comment to add to comments list
        xhr.onload = () => this.loadCommentsFromServer(); //call load comments from server function on line 7
        xhr.send(data);
    }
    componentDidMount() { //This function gets called right after Render..so right after constructor intialization on CommentBox
        this.loadCommentsFromServer();
        window.setInterval(
            () => this.loadCommentsFromServer(),
            this.props.pollInterval,
        );
    }
    render() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList commentz={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
}

class CommentList extends React.Component {
    render() {
        const commentNodes = this.props.commentz.map(y => (
            <Comment author={y.author} key={y.id}>
                {y.text}
            </Comment>
        ));
        return <div className="commentList">{commentNodes}</div>;
    }
}

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { author: '', text: '' };
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleAuthorChange(e) {
        this.setState({ author: e.target.value });
    }
    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        // TODO: send request to the server
        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    }
    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
}

function createRemarkable() {
    var remarkable =
        'undefined' != typeof global && global.Remarkable
            ? global.Remarkable
            : window.Remarkable;

    return new remarkable();
}

class Comment extends React.Component {
    rawMarkup() {
        const md = new Remarkable();
        const rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    }
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}

ReactDOM.render(<CommentBox
    url="/comments"
    submitUrl="/comments/new"
    pollInterval={2000}
/>, document.getElementById('content'));