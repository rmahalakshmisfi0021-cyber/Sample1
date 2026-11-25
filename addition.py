"""Simple addition program."""


def add(a: float, b: float) -> float:
    """Return the sum of a and b."""
    return a + b


def main() -> None:
    try:
        a = float(input("Enter first number: "))
        b = float(input("Enter second number: "))
    except ValueError:
        print("Error: please enter valid numbers.")
        raise SystemExit(1)
    print(f"{a} + {b} = {add(a, b)}")


if __name__ == "__main__":
    main()
