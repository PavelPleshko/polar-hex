---
pageTitle: Tackling the nesting problem
description: "Deep nesting or too much indendation in the code leads to a lot of confusion when reading through already
complex logic. This post will offer some common tips to deal with it."
imageUrl: "/nesting/feature.jpg"
imageCaption: '<a href="https://www.freepik.com/free-photo/jabiru-stork-nest-high-dry-tree-brazilian-pantanal_17897652.htm#query=nesting&position=31&from_view=search&track=sph">
Image by vladimircech</a> on Freepik'
date: 2023-02-18
contentTags: ["refactoring", "coding practices"]
draft: true
---

## Introduction

It's fair to say that deeply nested code has been torturing many developers for
quite some time. Indeed, deep nesting is considered a **code smell** and might
be a signal to reconsider the design of your code structures and do some
refactoring.

This issue can manifest itself very often when we try to write more or less complex
logic with many conditions to check, loops to run and those constructs are usually
combined in the process making the code highly unreadable and hard to maintain.

### Why this is not great?

Deeply nested conditionals make it almost impossible to understand the control flow
of the function, when different parts of it will run and when to expect state changes
in your program. Everything just gets blurry until you put on your debugging hat and
go through code statement by statement reproducing all the necessary environment to reach
those parts that are wrapped and hidden from the naked eye.

This is bad, because, after all, when reading the code that you are going to work with
on a more detailed level - it might already be too overwhelming, let alone instrumenting
the code to run in debug mode to understand maybe not the most crucial parts of logic.
Moreover, human brain is not a machine (well, this is not true for some, but let's assume the worst :))
and as a result keeping too many things on the "stack" will make it overflow and let
the reading begin again.

## What can be done?

There are definitely some useful techniques to deal with deeply nested code, they are mostly focused
on making it flat, because flat is more readable than its counterpart.

### Use guard clauses

The most common way to get rid of excessive indentation is to simply return early if function
can not execute its main chunk of logic. When we wrap this logic with one if statement which tests
whether it should be executed or simply be ignored - we add an indentation, additional context to
keep in mind which might not be such a bad thing, however it is better to have readability from day 1
if possible.

Consider a simple example:

```ts
class Form {
	private _value = '';

	updateField(value?: string): void {
		if (value) {
			this._value = value.trim();
		}
	}
}
```

Seems like no big deal, but it already starts to feel "indented". The main chunk of logic in this
function is to "groom" the incoming value before it is set to the instance of the _Form_, and it is
a little obstructed. Let's see how the refactored version would look like:

```ts
class Form {
	private _value = '';

	updateField(value?: string): void {
		if (!value) return;

		this._value = value.trim();
	}
}
```

No indentation - less mental effort to make, the reader discards the conditions
that do not allow to perform the main logic and focuses on what really matters,
what function was made for.

Let's take a look at more serious example as it was just a warm-up. Take a look at the following:

```ts
class Listcomponent {
	onKeyDown(event: KeyboardEvent) {
		if (!this.disabled) {
			if (isNavigationKey(event.key)) {
				let navigationDelta = 0;
				if (this.orientation === 'vertical') {
					navigationDelta = event.key === 'ArrowDown' ? 1 : -1;
				} else if (this.orientation === 'horizontal') {
					navigationDelta = event.key === 'ArrowRight' ? 1 : -1;
				}
				this._navigateByDelta(navigationDelta);
			}

			if (event.key === 'Enter' || event.key === 'Space') {
				const previous = this.value;

				this.selectCurrentlyActive();

				const changed = this.value !== previous;

				if (!changed) {
					this.valueConfirmed.emit(this.value);
				}
			}
		}
	}
}
```

This is a list component which inevitably needs some interaction handling. There are
several requirements to the method:

1. This list can be disabled and no action should be taken.
2. We need to handle the actual side effect by selecting the option or navigating through list depending on orientation.
3. If the pressed key is not what we need - do not do anything either.
4. Propagate changes if the right signals were dispatched from the user and the value has changed.

In current example it was handled with several levels of nesting, which is not easy to map in our minds.
As previously the main logic of the function is wrapped in if statement which guards it from being executed
when ListComponent is not in active state.

There are more things that could be refactored to make it more readable, but we will focus on the guard clauses for now.
The steps we are going to take are:

1. Move the overarching if statement out of the way.
2. Return early when selection action keys are not pressed.

#### Overarching if statement

```ts
class Listcomponent {
	onKeyDown(event: KeyboardEvent) {
		if (this.disabled) return;

		if (isNavigationKey(event.key)) {
			// navigation logic omitted for brevity
		}

		if (event.key === 'Enter' || event.key === 'Space') {
			const previous = this.value;

			this.selectCurrentlyActive();

			const changed = this.value !== previous;

			if (!changed) {
				this.valueConfirmed.emit(this.value);
			}
		}
	}
}
```

#### Filter unneeded keys

```ts
const ACTION_KEYS = ['Enter', 'Space'];

class Listcomponent {
	onKeyDown(event: KeyboardEvent) {
		if (this.disabled) return;

		if (isNavigationKey(event.key)) {
			// navigation logic omitted for brevity
		}

		if (!ACTION_KEYS.includes(event.key)) return;

		const previous = this.value;

		this.selectCurrentlyActive();

		if (this.value !== previous) {
			this.valueConfirmed.emit(this.value);
		}
	}
}
```

A note on the guard clauses: it is not uncommon to see a value returned, like
booleans, empty arrays - those are all valid cases. In our case we looked at method
which performed some side effects rather than querying for information.

We removed some nesting, but our function suffers from handling multiple responsibilities - navigation and selection,
and it is more obvious now after refactoring. Let's see how can we improve it further.

### Extract nested code into its own method

You can often improve the overall situation by chunking and abstracting
away the logic into its own corresponding functions, thus making the main
flow clearer to the reader.
It is debatable however if the following refactoring is the best way to
reorganize code, but it definitely removes responsibilities from the
main function. We simply delegate the actions to specialized methods of
the `ListComponent`.
Another way to deal with this is to leave `if-then-else` in the main flow
and call newly extracted methods with more strictly typed arguments, so
decision branching is not hidden in those methods, but it is not for free as
it requires to nest one level.

```ts
const ACTION_KEYS = ['Enter', 'Space'];

class Listcomponent {
	onKeyDown(event: KeyboardEvent) {
		if (this.disabled) return;

		this._navigateByKey(event.key);
		this._selectByKey(event.key);
	}

	private _navigateByKey(key: string): void {
		if (!isNavigationKey(key)) return;

		let navigationDelta = 0;
		if (this.orientation === 'vertical') {
			navigationDelta = key === 'ArrowDown' ? 1 : -1;
		} else if (this.orientation === 'horizontal') {
			navigationDelta = key === 'ArrowRight' ? 1 : -1;
		}
		this._navigateByDelta(navigationDelta);
	}

	private _selectByKey(key: string): void {
		if (!ACTION_KEYS.includes(key)) return;

		const previous = this.value;

		this.selectCurrentlyActive();

		if (this.value !== previous) {
			this.valueConfirmed.emit(this.value);
		}
	}
}
```

Now our main method performs orchestration and private methods do the
actual logic, the confirmation is emitted when the value is selected instead
of being mixed together with the navigation logic.

Navigation method still feels quite clunky and extra nesting is hidden behind
ternary expressions practically acting as a syntactic sugar here. We can do better
for sure.

### Use lookup objects

Our list component has the ability to navigate through its own items and the
navigation keys varies for different orientations as you can see from the code.
However, one thing they have in common at this stage - is that you move through
items at a consistent rate with 1 element at a time. This can get more complex
if we add **HOME** and **END** keys to move to the first and to the last item
in the list, although the same solution could be applied regardless.

Our goal is to find out direction in which we can move, a "navigationDelta". Let's
create a lookup object as follows:

```ts
const NAVIGATION_LOOKUP = {
	vertical: {
		ArrowUp: -1,
		ArrowDown: 1,
	},
	horizontal: {
		ArrowLeft: -1,
		ArrowRight: 1,
	},
};
```

Our decision logic for navigation now can be rewritten in a simpler way:

```ts
class Listcomponent {
	// other logic omitted for brevity

	private _navigateByKey(key: string): void {
		if (!isNavigationKey(key)) return;

		const navigationDelta = NAVIGATION_LOOKUP[this.orientation][key] || 0;

		this._navigateByDelta(navigationDelta);
	}
}
```

Looks much better without these conditionals.

Let's compare the code now!

Before:

```ts
class Listcomponent {
	onKeyDown(event: KeyboardEvent) {
		if (!this.disabled) {
			if (isNavigationKey(event.key)) {
				let navigationDelta = 0;
				if (this.orientation === 'vertical') {
					navigationDelta = event.key === 'ArrowDown' ? 1 : -1;
				} else if (this.orientation === 'horizontal') {
					navigationDelta = event.key === 'ArrowRight' ? 1 : -1;
				}
				this._navigateByDelta(navigationDelta);
			}

			if (event.key === 'Enter' || event.key === 'Space') {
				const previous = this.value;

				this.selectCurrentlyActive();

				const changed = this.value !== previous;

				if (!changed) {
					this.valueConfirmed.emit(this.value);
				}
			}
		}
	}
}
```

and after refactoring:

```ts
const NAVIGATION_LOOKUP = {
	vertical: {
		ArrowUp: -1,
		ArrowDown: 1,
	},
	horizontal: {
		ArrowLeft: -1,
		ArrowRight: 1,
	},
};
const ACTION_KEYS = ['Enter', 'Space'];

class Listcomponent {
	onKeyDown(event: KeyboardEvent) {
		if (this.disabled) return;

		this._navigateByKey(event.key);
		this._selectByKey(event.key);
	}

	private _navigateByKey(key: string): void {
		if (!isNavigationKey(key)) return;

		const navigationDelta = NAVIGATION_LOOKUP[this.orientation][key] || 0;

		this._navigateByDelta(navigationDelta);
	}

	private _selectByKey(key: string): void {
		if (!ACTION_KEYS.includes(key)) return;

		const previous = this.value;

		this.selectCurrentlyActive();

		if (this.value !== previous) {
			this.valueConfirmed.emit(this.value);
		}
	}
}
```

The final code might look a bit bigger, but it is much more human friendly and methods follow single
responsibility principle. On top of that if we decide to expand the navigation logic - it is much easier
with lookup object than building more and more complex pieces of conditionals at the expense of readability.

## Final words

Let's summarize what we have learned in this article:

1. Deeply nested code **impairs readability**, so we should avoid it whenever we can.
2. Deeply nested code might be a signal of a **design issue**.
3. Most common way to unravel deep nesting is to **return early** from the function in question.
   This lets us see clearly the main purpose of the function for which it was created.
4. We can also extract the nested code into **separate methods** to hide complexity from the main flow.
5. At times there is a logic that might warrant a **lookup object** to be setup.

There are other ways to deal with branching such as leveraging polymorphism including null-objects, but
that is a topic for another time.

Now, to be safe, these kind of refactorings are best in combination with good test coverage as it is
easy to get it wrong or break existing functionality.
