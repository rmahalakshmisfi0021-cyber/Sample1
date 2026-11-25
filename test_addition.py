"""Tests for addition.py."""
import unittest

from addition import add


class TestAdd(unittest.TestCase):
    def test_positive_integers(self) -> None:
        self.assertEqual(add(2, 3), 5)

    def test_negative_numbers(self) -> None:
        self.assertEqual(add(-4, -6), -10)

    def test_mixed_signs(self) -> None:
        self.assertEqual(add(-1, 1), 0)

    def test_floats(self) -> None:
        self.assertAlmostEqual(add(0.1, 0.2), 0.3)

    def test_zero(self) -> None:
        self.assertEqual(add(0, 0), 0)


if __name__ == "__main__":
    unittest.main()
