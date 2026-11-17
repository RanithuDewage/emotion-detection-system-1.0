"""
Server module for the Emotion Detection application.
This module handles the Flask routing and requests for emotion analysis.
"""

from flask import Flask, render_template, request, jsonify
from EmotionDetection.emotion_detection import emotion_detector

app = Flask("Emotion Detection")


@app.route("/")
def render_index_page():
    """
    Renders the main application index page.
    """
    return render_template('index.html')


@app.route("/emotionDetector")
def sent_analyzer():
    """
    Analyzes the text provided by the user and returns the emotion scores
    along with the dominant emotion, or an error message if invalid.
    """
    text_to_analyze = request.args.get('textToAnalyze')
    response = emotion_detector(text_to_analyze)
    dominant_emotion = response['dominant_emotion']

    if dominant_emotion is None:
        if request.args.get('format') == 'json':
            return jsonify({'error': 'Invalid text! Please try again!'}), 400
        return "Invalid text! Please try again!"

    if request.args.get('format') == 'json':
        return jsonify(response)

    anger = response['anger']
    disgust = response['disgust']
    fear = response['fear']
    joy = response['joy']
    sadness = response['sadness']
    output_string = (f"For the given statement, the system response is "
                     f"'anger': {anger}, 'disgust': {disgust}, 'fear': {fear}, "
                     f"'joy': {joy} and 'sadness': {sadness}. "
                     f"The dominant emotion is {dominant_emotion}.")
    return output_string


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
