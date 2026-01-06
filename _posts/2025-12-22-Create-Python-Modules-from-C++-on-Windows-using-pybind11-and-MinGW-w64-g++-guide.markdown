---
layout: default
title:  "Create Python Modules from C++ on Windows using pybind11 and MinGW-w64 (g++ Guide)"
excerpt: "Step-by-step guide to creating Python modules from C++ on Windows using pybind11 and MinGW-w64, with g++ commands and real examples." 
categories: blogs
permalink: /blogs/Create-Python-Modules-from-C++-on-Windows-using-pybind11-and-MinGW-w64-g++-guide/
---

<h1>Create Python Modules from C++ on Windows using pybind11 and MinGW-w64 (g++ Guide)</h1>

Python is easy to use but often struggles with performance-heavy workloads.
That’s why many popular libraries such as NumPy, OpenCV, and TensorFlow rely on C++ extensions under the hood.

***Pybind11 is the bridge which helps smoothen the journey from C++ to Python.***

<img src="/assets/post_images/pybind11.png" alt="Pybind11 is your bridge between C++ and Python." class="post-content-img">

---

<h2>Content</h2>
{% raw %}
* TOC
{:toc}
{% endraw %}

---

In this guide, you will learn how to create Python modules from C++ on Windows using
**pybind11** and **MinGW-w64 (g++)**.
We will cover practical build commands, object file generation, and how to create a
<code>.pyd</code> module that can be imported directly into Python.

By combining modern C++ with pybind11, you can build native Python extensions that deliver near-zero overhead and full control over memory and execution.

Before actual implementation let’s first understand some key points, like although there are other alternative binding approaches such as CPython, SWIG, Boost and nanobind, what does Pybind11 makes so special?

## Why Use pybind11 for C++ to Python Bindings?

Unlike Boost.Python or C-API bindings, pybind11 offers some unique features:

### Key Features of pybind11

- Header-only design

- Minimal runtime overhead

- Native STL support

- RAII-safe memory management

- Full compatibility with modern C++17+

### Advanced Use Cases

- Wrapping legacy C++ libraries

- SIMD / OpenMP acceleration

- Zero-copy NumPy buffers

- Cross-language API design

- ABI-stable plugin systems


### Why This Approach Is Powerful?

Using C++ with Python via pybind11 allows you to:

- Reuse existing C++ codebases

- Combine Python’s simplicity with C++ speed

- Deploy cross-language solutions efficiently

This is widely used in machine learning, computer vision, game engines, and scientific computing.

--- 

## How to Create a Python (*.pyd*) Module using pybind11

Now, that we have gone through the introduction and importance of the pybind11, let's get to the important step, how to use it to create python modules from C++.

### Toolchain Requirements

- Python 3.x

- MinGW-w64 GCC toolchain

- pybind11 library

- Matching libpython3xx.a

### Step by Step Build Process

**1. Install pybind11** (Preferably in a python virtual envioronment)
```console
pip install pybind11
```
**2. Create Pybind11 cpp file for your C++ class**

The example C++ class is as follows:

```cpp
#include <CPlusPlusClass.h>

CPlusPlusClass::CPlusPlusClass(int a=0, int b=0) {
	a_int= a;
	b_int = b;
}

int CPlusPlusClass::addition(){
	return (a_int + a_int);
}
```

Corresponding PYBIND11_MODULE function.

```cpp
#include <CPlusPlusClass.h>
#include <pybind11/pybind11.h>

namespace py = pybind11;

// This is your python module name (.pyd file name)
PYBIND11_MODULE(CPlusPlusClass, m) {
    m.doc() = "Dummy C++ module using pybind11";

    // This is your actual C++ class name
    py::class_<CPlusPlusClass>(m, "CPlusPlusClass")
        
      // For the C++ constructor, alongwith data types
      .def(py::init<int, int>())
      
      //Any other public or private method. 
      .def("addition", &CPlusPlusClass::addition);
}
```

**3. Create corresponding object files using g++ command**
- MingW64 is required for this step
- Command to create object file
```bash
g++ -O2 -Wall -std=c++17 -fPIC  -I"C:<your path>\python_<version>\Include" -I"<your project .h files>\include" -I"D:<you python installation / venv path>\lib\site-packages\pybind11\include" -c <the path to your C++ source code> -o <the pyth where you want to store generated .o file>
```
- Create respective object files of PYBIND11_MODULE function ( in my case I have it in pybind11.cpp) and  C++ class.

**4. Create Python dynamic module**
- The following command basically links the generated object files and creates the .pyd module.
- You can use this .pyd module in any python script.
```bash
g++ -shared <your C++ class object file> <your pybind11 object file> -o <the pyth where you want to store .pyd file> -L"C:<your path>\python_<version>\libs" -lpython<your python version from libs folder>
```
Note: If you have python 3.10 installed then in corresponding libs folder you will find python310.lib, which you have to use in command as -lpython310

**5. Add required DLL files**
- A generated **.pyd** file is just a Windows DLL that Python loads.
When Windows loads a DLL, it must also find all following dependent DLLs.
- Copy paste the following DLL files from **mingw64/bin/** to same folder as .pyd file. Copying them next to the .pyd works because Windows searches the module directory first.

  1. libwinpthread-1.dll
  2. libstdc++-6.dll
  3. libgcc_s_seh-1.dll

**6. Test .pyd module**
- All done, you can include the .pyd module and test it.

```python
import CPlusPlusClass

obj = CPlusPlusClass.CPlusPlusClass(10,10)
print("Sum is:", obj.addition())
```
Creating the above g++ commands repeatedly can quickly become **tedious and error-prone**, especially when working with multiple source files or environments.

To simplify this process, I’ve created a batch script called `build_pyd_automate.bat` that automates the creation of the `.pyd` module for you. You can find this script in **my GitHub repository**: <a href="https://github.com/kundan21099/create_python_module_of_cplusplus" target="_blank" rel="nofollow">create_python_module_of_cplusplus</a>.

The script automates most of the build steps; only a few paths need to be configured based on your local setup. This is a **one-time change and easy to update**. Just make sure that your Python virtual environment (where pybind11 is installed) is activated before running the batch file.

---

## Limitations and Alternative approaches

While **pybind11** provides a modern, expressive, and header-only interface for creating Python bindings from C++, it comes with some trade-offs. Compilation times can increase due to heavy template usage, and bindings are tightly coupled to specific compiler and Python versions. 

There are high chances that the same `.pyd` module will not work on different PC, therefore on new PC you need to rebuild `.pyd` again. 

Because `.pyd` is ABI-coupled to following things. If you want to run same `.pyd` on different PC, then all of these must match:

1. Python version 

2. Compiler & runtime ABI (this is the big one), your .pyd is tightly bound to:
- MinGW flavor (MSYS2 / standalone)
- GCC version
- Exception model (seh, sjlj, dwarf)
- Threading model (posix vs win32)
- libstdc++ ABI version

In addition to pybind11, several other established approaches exist for creating Python extensions from C++ code, each serving different design goals.

**Nanobind**

A lightweight alternative developed by the same author, addresses some of these issues by reducing compilation overhead and providing faster build times while maintaining a similar high-level API. Like pybind11, it still requires careful management of ABI compatibility and Python version constraints. Both libraries are highly effective for exposing C++ code to Python, and the choice depends on project size, performance needs, and developer familiarity. For detailed benchmarks, see the <a href="https://nanobind.readthedocs.io/en/latest/benchmark.html" target="_blank" rel="nofollow">nanobind comparison benchmarks</a>.

**CPython C API**

The CPython C API is the reference interface provided by the Python implementation for writing extension modules in C or C++. It exposes low-level access to Python objects, memory management, and interpreter internals. While this interface enables fine-grained control and optimal performance, it requires explicit management of reference counts and careful handling of error states.
<a href="https://docs.python.org/3/extending/extending.html" target="_blank" rel="nofollow">CPython C API — Extending and Embedding Python</a>

**Boost.Python**

Boost.Python is a C++ library within the Boost ecosystem that facilitates interoperability between C++ and Python. It provides comprehensive support for complex C++ language features and is well suited for projects that already depend on Boost. Its usage may introduce additional build dependencies and increased compilation time, which should be considered when evaluating project complexity.
<a href="https://www.boost.org/doc/libs/latest/libs/python/doc/html/tutorial/tutorial/hello.html" target="_blank" rel="nofollow">Boost.Python Tutorial</a>

**SWIG (Simplified Wrapper and Interface Generator)**

SWIG is a wrapper generation tool designed to connect C and C++ code with multiple target languages, including Python. It is commonly applied to large or existing codebases where automated binding generation is desirable. The generated interfaces may require further customization to conform to idiomatic Python API design.
<a href="https://www.swig.org/Doc1.3/Python.html" target="_blank" rel="nofollow">SWIG Python Documentation</a>

---

## Comparison Table of C++ to Python Binding Tools

<style>
    
  .binding-table {
    width: 100%;
    border-collapse: collapse;
    margin: 30px 0;
    font-family: Arial, sans-serif;
    font-size: 15px;
  }

  .binding-table thead {
    background-color: #83aef2ff;
    color: #e23333ff;
  }

  .binding-table th,
  .binding-table td {
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    text-align: center;
  }

  .binding-table th:first-child,
  .binding-table td:first-child {
    text-align: left;
    font-weight: 600;
  }

  .binding-table tbody tr:nth-child(even) {
    background-color: #f8fafc;
  }

  .binding-table tbody tr:hover {
    background-color: #eef2ff;
    transition: background-color 0.2s ease-in-out;
  }

  .tool-name {
    font-weight: 700;
    color: #1e293b;
  }

  .stars {
    color: #f59e0b;
    font-size: 14px;
    letter-spacing: 1px;
  }

  .use-case {
    font-size: 14px;
    color: #334155;
  }

</style>

<table class="binding-table">
  <thead>
    <tr>
      <th>Tool / Library</th>
      <th>Ease of Use</th>
      <th>Performance</th>
      <th>Build Complexity</th>
      <th>Pythonic API</th>
      <th>Ideal Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tool-name">pybind11</td>
      <td class="stars">★★★★★</td>
      <td class="stars">★★★★☆</td>
      <td class="stars">★★☆☆☆</td>
      <td class="stars">★★★★★</td>
      <td class="use-case">Modern C++ → Python bindings</td>
    </tr>
    <tr>
      <td class="tool-name">CPython C API</td>
      <td class="stars">★☆☆☆☆</td>
      <td class="stars">★★★★★</td>
      <td class="stars">★★★★☆</td>
      <td class="stars">★☆☆☆☆</td>
      <td class="use-case">Low-level & core Python extensions</td>
    </tr>
    <tr>
      <td class="tool-name">Boost.Python</td>
      <td class="stars">★★☆☆☆</td>
      <td class="stars">★★★★☆</td>
      <td class="stars">★★★★☆</td>
      <td class="stars">★★★☆☆</td>
      <td class="use-case">Large Boost-based C++ projects</td>
    </tr>
    <tr>
      <td class="tool-name">Cython</td>
      <td class="stars">★★★★☆</td>
      <td class="stars">★★★★☆</td>
      <td class="stars">★★☆☆☆</td>
      <td class="stars">★★★★☆</td>
      <td class="use-case">Optimizing Python-heavy codebases</td>
    </tr>
    <tr>
      <td class="tool-name">SWIG</td>
      <td class="stars">★★☆☆☆</td>
      <td class="stars">★★★☆☆</td>
      <td class="stars">★★★★☆</td>
      <td class="stars">★★☆☆☆</td>
      <td class="use-case">Multi-language bindings</td>
    </tr>
    <tr>
      <td class="tool-name">nanobind</td>
      <td class="stars">★★★☆☆</td>
      <td class="stars">★★★★★</td>
      <td class="stars">★★☆☆☆</td>
      <td class="stars">★★★★☆</td>
      <td class="use-case">High-performance native extensions</td>
    </tr>
  </tbody>
</table>

---

## Final Thoughts

Each approach has its place, and the optimal solution depends on the specific technical and organizational constraints of the project.

Creating Python modules from C++ using pybind11 and MinGW-w64 is not only powerful but surprisingly elegant once you understand the workflow.

If you’re serious about performance and scalability in Python, learning C++ bindings with pybind11 is a game-changer.

For those who would like to avoid manual build steps, I’ve shared an automated batch script and example project in my GitHub repository <a href="https://github.com/kundan21099/create_python_module_of_cplusplus" target="_blank" rel="nofollow">create_python_module_of_cplusplus</a>.
. Feel free to use or adapt it for your own workflow.

There are different methods to create python binding using pybind11. To learn advance usage of pybind11 you can also refer the <a href="https://pybind11.readthedocs.io/en/stable/advanced/classes.html" target="_blank" rel="nofollow">official documentation</a>.


***💡 Pro tip:*** 
- Start small and automate your builds.

- If you prefer not to install MinGW-w64 separately, you can use the GCC toolchain bundled with your IDE. For example, Eclipse often includes a compatible `g++.exe`, which can be executed directly from its bin directory (e.g., `C:\<path>\eclipse\mingw\mingw64\bin`), as long as it matches your Python architecture.

---

## Frequently Asked Questions (FAQ)

<h3>Is pybind11 better than Cython?</h3>
pybind11 is ideal for exposing existing C++ libraries to Python, while Cython is better for optimizing Python code itself.

<h3>Why is a .pyd file used on Windows?</h3>
Windows uses <code>.pyd</code> files as dynamically loadable Python extension modules,
similar to <code>.so</code> files on Linux.

<h3>Is there any alternative to MinGW?</h3>
Yes, you can also use MSYS2, Cygwin or WSL. As long as you can run g++ compiler on windows any option is fine.

<h3>Is it possible to make a .pyd that works on different PCs?</h3>
Yes, but only if you follow Windows/Python’s ABI rules. In this case using Microsoft Visual C++ (MSVC) would be a better choice as it has a stable C/C++ ABI.

<h3>Similar implementation on Linux or MacOS is possible?</h3>
Yes, infact Linux and macOS often comes with g++ compiler.

