"""
Unit tests for the Emotion Detection application.
Verifies dominant emotion predictions for various emotional statements.
"""

import unittest
from EmotionDetection.emotion_detection import emotion_detector


class TestEmotionDetector(unittest.TestCase):
    """
    Test suite for emotion detection function.
    """

    def test_emotion_detector(self):
        """
        Tests emotion detection across standard test statements.
        """
        result_1 = emotion_detector("I am glad this happened")
        self.assertEqual(result_1['dominant_emotion'], 'joy')

        result_2 = emotion_detector("I am really mad about this")
        self.assertEqual(result_2['dominant_emotion'], 'anger')

        result_3 = emotion_detector("I feel disgusted just hearing about this")
        self.assertEqual(result_3['dominant_emotion'], 'disgust')

        result_4 = emotion_detector("I am so sad about this")
        self.assertEqual(result_4['dominant_emotion'], 'sadness')

        result_5 = emotion_detector("I am really afraid that this will happen")
        self.assertEqual(result_5['dominant_emotion'], 'fear')

    def test_blank_input(self):
        """
        Tests error handling on empty or whitespace strings.
        """
        result_blank = emotion_detector("")
        self.assertIsNone(result_blank['dominant_emotion'])

        result_spaces = emotion_detector("   ")
        self.assertIsNone(result_spaces['dominant_emotion'])


if __name__ == '__main__':
    unittest.main()
