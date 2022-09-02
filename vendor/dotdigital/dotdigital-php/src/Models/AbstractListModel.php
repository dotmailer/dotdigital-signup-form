<?php

declare(strict_types=1);

namespace Dotdigital\Models;

use Dotdigital\Exception\ResponseValidationException;

abstract class AbstractListModel extends AbstractModel
{
    /**
     * AbstractListModel constructor.
     *
     * @param string|array<mixed> $content
     *
     * @throws \Exception
     */
    public function __construct(
        $content
    ) {
        $this->validate($content);
    }

    /**
     * @param array<mixed> $listItem
     *
     * @return AbstractSingletonModel
     */
    abstract protected function getOne(array $listItem);

    /**
     * @param string|array<mixed> $content
     *
     * @return void
     * @throws ResponseValidationException
     */
    protected function validate($content)
    {
        if (is_string($content) && json_decode($content)) {
            $content = json_decode($content, true);
        }
        foreach ($content as $key => $value) {
            if ($this->ignoreKey($key)) {
                continue;
            }
            $this->$key = $this->getOne($value);
        }
    }

    /**
     * Utility to return a list-type object as an array.
     *
     * @return array<mixed>
     */
    public function toArray()
    {
        return (array) $this;
    }

    /**
     * @param string $key
     * @return bool
     */
    public function ignoreKey($key)
    {
        if (property_exists($this, 'ignore')) {
            return in_array($key, $this->ignore);
        };

        return false;
    }
}
